package com.progmasters.hotel.service;

import com.progmasters.hotel.domain.Account;
import com.progmasters.hotel.domain.Booking;
import com.progmasters.hotel.domain.Room;
import com.progmasters.hotel.domain.RoomReservation;
import com.progmasters.hotel.dto.BookingCreateItem;
import com.progmasters.hotel.dto.BookingDetails;
import com.progmasters.hotel.dto.BookingListItem;
import com.progmasters.hotel.repository.AccountRepository;
import com.progmasters.hotel.repository.BookingRepository;
import com.progmasters.hotel.repository.RoomRepository;
import com.progmasters.hotel.repository.RoomReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
@Transactional
public class BookingService {

    private BookingRepository bookingRepository;
    private RoomReservationRepository roomReservationRepository;
    private RoomRepository roomRepository;
    private AccountRepository accountRepository;

    @Autowired
    public BookingService(RoomReservationRepository roomReservationRepository, BookingRepository bookingRepository, RoomRepository roomRepository, AccountRepository accountRepository) {
        this.bookingRepository = bookingRepository;
        this.roomReservationRepository = roomReservationRepository;
        this.roomRepository = roomRepository;
        this.accountRepository = accountRepository;
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
        booking.setGuest(guestAccount);

        roomReservations.forEach(this.roomReservationRepository::save);
        this.bookingRepository.save(booking);

        //TODO send an email!!!!
        return booking.getId();
    }


    public List<BookingListItem> getBookingListItemList() {
        return bookingRepository.findAll().stream().map(BookingListItem::new).collect(Collectors.toList());
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
