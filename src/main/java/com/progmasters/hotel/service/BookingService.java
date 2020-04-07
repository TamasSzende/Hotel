package com.progmasters.hotel.service;

import com.progmasters.hotel.domain.Account;
import com.progmasters.hotel.domain.Booking;
import com.progmasters.hotel.domain.Room;
import com.progmasters.hotel.domain.RoomReservation;
import com.progmasters.hotel.dto.BookingCreateItem;
import com.progmasters.hotel.dto.BookingDetails;
import com.progmasters.hotel.dto.BookingListItemForHotel;
import com.progmasters.hotel.dto.BookingListItemForUser;
import com.progmasters.hotel.repository.AccountRepository;
import com.progmasters.hotel.repository.BookingRepository;
import com.progmasters.hotel.repository.RoomRepository;
import com.progmasters.hotel.repository.RoomReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
@Transactional(isolation = Isolation.READ_COMMITTED)
public class BookingService {

    private BookingRepository bookingRepository;
    private RoomReservationRepository roomReservationRepository;
    private RoomRepository roomRepository;
    private AccountRepository accountRepository;
    private static final ZoneId HOTELS_ZONEID = ZoneId.of("Europe/Budapest");
    private EmailService emailService;

    @Autowired
    public BookingService(RoomReservationRepository roomReservationRepository, BookingRepository bookingRepository, RoomRepository roomRepository, AccountRepository accountRepository, EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.roomReservationRepository = roomReservationRepository;
        this.roomRepository = roomRepository;
        this.accountRepository = accountRepository;
        this.emailService = emailService;
    }

    public Long saveBooking(BookingCreateItem bookingCreateItem) {
        Booking booking = new Booking(bookingCreateItem);

        //Check the rooms are in the same hotel
        Long hotelId = getHotelIdAndValidate(bookingCreateItem);
        if (hotelId == null) return null;

        //Check the time: later than now, end is later then start (and not equal)
        Long numberOfNights = DAYS.between(bookingCreateItem.getStartDate(), bookingCreateItem.getEndDate());
        if (numberOfNights < 1) return null;
        if (bookingCreateItem.getStartDate().isBefore(LocalDate.now())) return null;

        //Check the rooms are free and exist (and create RoomReservation List)
        List<RoomReservation> roomReservations = getRoomReservationsAndValidate(bookingCreateItem, booking);
        if (roomReservations.isEmpty()) return null;

        double priceOfBooking = getPriceOfBooking(numberOfNights, bookingCreateItem);
        booking.setPriceOfBooking(priceOfBooking);

        //TODO check account is exist and user role
        Account guestAccount = this.accountRepository.findByUsername(bookingCreateItem.getGuestAccountName());
        if (guestAccount == null) return null;
        booking.setGuest(guestAccount);

        roomReservations.forEach(this.roomReservationRepository::save);
        this.bookingRepository.save(booking);

        emailService.sendMailAtBooking(guestAccount);

        return booking.getId();
    }

    public boolean deleteBooking(Long bookingId) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (bookingOptional.isPresent()) {
            Booking booking = bookingOptional.get();
            List<RoomReservation> deletedRoomReservations = booking.getRoomReservations();
            for (RoomReservation deletedRoomReservation : deletedRoomReservations) {
                this.roomReservationRepository.delete(deletedRoomReservation);
            }
            bookingRepository.delete(booking);

            emailService.sendMailAtDeleteBooking(booking.getGuest());

            return true;
        } else {
            return false;
        }
    }

    public BookingDetails getBookingDetails(Long bookingId) {
        BookingDetails bookingDetails;
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            bookingDetails = new BookingDetails(optionalBooking.get());
        } else {
            throw new IllegalArgumentException("There is no Booking for this id:" + bookingId);
        }
        return bookingDetails;
    }

    public List<BookingListItemForHotel> getBookingListByRoom(Long roomId) {
        return bookingRepository.findAllByRoomId(roomId).stream().map(BookingListItemForHotel::new).collect(Collectors.toList());
    }

    public List<BookingListItemForHotel> getCurrentBookingListByRoom(Long roomId) {
        return bookingRepository.findCurrentByRoomId(roomId, LocalDate.now(HOTELS_ZONEID))
                .stream().map(BookingListItemForHotel::new).collect(Collectors.toList());
    }

    public List<BookingListItemForHotel> getFutureBookingListByRoom(Long roomId) {
        return bookingRepository.findFutureByRoomId(roomId, LocalDate.now(HOTELS_ZONEID))
                .stream().map(BookingListItemForHotel::new).collect(Collectors.toList());
    }

    public List<BookingListItemForHotel> getPastBookingListByRoom(Long roomId) {
        return bookingRepository.findPastByRoomId(roomId, LocalDate.now(HOTELS_ZONEID))
                .stream().map(BookingListItemForHotel::new).collect(Collectors.toList());
    }

    public List<BookingListItemForHotel> getBookingListByHotel(Long hotelId) {
        return bookingRepository.findAllByHotelId(hotelId).stream().map(BookingListItemForHotel::new).collect(Collectors.toList());
    }

    public List<BookingListItemForHotel> getCurrentBookingListByHotel(Long hotelId) {
        return bookingRepository.findCurrentByHotelId(hotelId, LocalDate.now(HOTELS_ZONEID))
                .stream().map(BookingListItemForHotel::new).collect(Collectors.toList());
    }

    public List<BookingListItemForHotel> getFutureBookingListByHotel(Long hotelId) {
        return bookingRepository.findFutureByHotelId(hotelId, LocalDate.now(HOTELS_ZONEID))
                .stream().map(BookingListItemForHotel::new).collect(Collectors.toList());
    }

    public List<BookingListItemForHotel> getPastBookingListByHotel(Long hotelId) {
        return bookingRepository.findPastByHotelId(hotelId, LocalDate.now(HOTELS_ZONEID))
                .stream().map(BookingListItemForHotel::new).collect(Collectors.toList());
    }

    public List<BookingListItemForUser> getBookingListByUser(Long userId) {
        return bookingRepository.findAllByUserId(userId).stream().map(BookingListItemForUser::new).collect(Collectors.toList());
    }

    public List<BookingListItemForUser> getCurrentBookingListByUser(Long userId) {
        return bookingRepository.findCurrentByUserId(userId, LocalDate.now(HOTELS_ZONEID))
                .stream().map(BookingListItemForUser::new).collect(Collectors.toList());
    }

    public List<BookingListItemForUser> getFutureBookingListByUser(Long userId) {
        return bookingRepository.findFutureByUserId(userId, LocalDate.now(HOTELS_ZONEID))
                .stream().map(BookingListItemForUser::new).collect(Collectors.toList());
    }

    public List<BookingListItemForUser> getPastBookingListByUser(Long userId) {
        return bookingRepository.findPastByUserId(userId, LocalDate.now(HOTELS_ZONEID))
                .stream().map(BookingListItemForUser::new).collect(Collectors.toList());
    }

    private List<RoomReservation> getRoomReservationsAndValidate(BookingCreateItem bookingCreateItem, Booking booking) {
        List<RoomReservation> roomReservations = new ArrayList<>();
        for (Long roomId : bookingCreateItem.getRoomIdList()) {
            Optional<Room> optionalRoom = this.roomRepository.findById(roomId);
            if (optionalRoom.isPresent()
                    && isRoomFree(roomId, bookingCreateItem.getStartDate(), bookingCreateItem.getEndDate())) {
                RoomReservation roomReservation = new RoomReservation(bookingCreateItem);
                roomReservation.setRoom(optionalRoom.get());
                roomReservation.setBooking(booking);
                roomReservations.add(roomReservation);
            } else {
                return new ArrayList<>();
            }
        }
        return roomReservations;
    }

    public boolean isRoomFree(Long roomId, LocalDate startDate, LocalDate enDate) {
        List<RoomReservation> roomReservations =
                this.roomReservationRepository.findAllByRoomIdAndEndDateAfterAndStartDateBefore(roomId, startDate, enDate);
        return roomReservations.isEmpty();
    }

    private Long getHotelIdAndValidate(BookingCreateItem bookingCreateItem) {
        Long hotelId = null;
        for (Long roomId : bookingCreateItem.getRoomIdList()) {
            Optional<Room> optionalRoom = this.roomRepository.findById(roomId);
            if (optionalRoom.isPresent()) {
                Room room = optionalRoom.get();
                Long actualHotelId = room.getHotel().getId();
                if (hotelId != null && !actualHotelId.equals(hotelId)) {
                    return null;
                } else {
                    hotelId = actualHotelId;
                }
            }
        }
        return hotelId;
    }

    private double getPriceOfBooking(Long numberOfNights, BookingCreateItem bookingCreateItem) {
        double priceOfBooking = 0.0;
        for (Long roomId : bookingCreateItem.getRoomIdList()) {
            Optional<Room> optionalRoom = this.roomRepository.findById(roomId);
            if (optionalRoom.isPresent()) {
                Room room = optionalRoom.get();
                priceOfBooking += room.getPricePerNight() * numberOfNights;
            }
        }
        return priceOfBooking;
    }

}
