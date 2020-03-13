package com.progmasters.hotel.service;

import com.progmasters.hotel.domain.Booking;
import com.progmasters.hotel.domain.Room;
import com.progmasters.hotel.domain.RoomReservation;
import com.progmasters.hotel.dto.BookingCreateItem;
import com.progmasters.hotel.dto.BookingDetails;
import com.progmasters.hotel.dto.BookingListItem;
import com.progmasters.hotel.repository.BookingRepository;
import com.progmasters.hotel.repository.HotelRepository;
import com.progmasters.hotel.repository.RoomRepository;
import com.progmasters.hotel.repository.RoomReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private HotelRepository hotelRepository;

    @Autowired
    public BookingService(RoomReservationRepository roomReservationRepository, BookingRepository bookingRepository, RoomRepository roomRepository, HotelRepository hotelRepository) {
        this.bookingRepository = bookingRepository;
        this.roomReservationRepository = roomReservationRepository;
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
    }

    public Long saveBooking(BookingCreateItem bookingCreateItem) {
        boolean isCreated = true;
        Booking booking = new Booking(bookingCreateItem);
        Long resultBookingId = null;


        //TODO validation (and refractoring???)
        //Check the rooms are in the same hotel
        Long hotelId = null;
        for (Long roomId : bookingCreateItem.getRoomIdList()) {
            Optional<Room> optionalRoom = this.roomRepository.findById(roomId);
            if (optionalRoom.isPresent()) {
                Room room = optionalRoom.get();
                Long actualHotelId = room.getHotel().getId();
                if (hotelId != null && actualHotelId != hotelId) {
                    return resultBookingId;
                } else {
                    hotelId = actualHotelId;
                }
            }
        }
        //Check the time, later than now, end is later then start (and not equal)
        Long numberOfNights = DAYS.between(bookingCreateItem.getStartDate(), bookingCreateItem.getEndDate());
        if (numberOfNights < 1) {
            return resultBookingId;
        }
        Double priceOfBooking = 0.0;

        //TODO Check the rooms are free!

        for (Long roomId : bookingCreateItem.getRoomIdList()) {
            Optional<Room> optionalRoom = this.roomRepository.findById(roomId);
            if (optionalRoom.isPresent()) {
                Room room = optionalRoom.get();
                RoomReservation roomReservation = new RoomReservation(bookingCreateItem);
                roomReservation.setBooking(booking);
                roomReservation.setRoom(room);
                this.roomReservationRepository.save(roomReservation);
                priceOfBooking += room.getPricePerNight() * numberOfNights;
            } else {
                isCreated = false;
            }
        }
        if (isCreated) {
            booking.setPriceOfBooking(priceOfBooking);
            this.bookingRepository.save(booking);
            resultBookingId = booking.getId();
        }
        return resultBookingId;
    }

    public List<BookingListItem> getBookingListItemList() {
        return bookingRepository.findAll().stream().map(BookingListItem::new).collect(Collectors.toList());
    }

    public BookingDetails getBookingDetails(Long bookingId) {
        BookingDetails bookingDetails = null;
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            bookingDetails = new BookingDetails(optionalBooking.get());
        } else {
            throw new IllegalArgumentException("There is no Booking for this id:" + bookingId);
        }
        return bookingDetails;
    }


}
