package com.progmasters.hotel.service;

import com.progmasters.hotel.domain.Booking;
import com.progmasters.hotel.domain.Room;
import com.progmasters.hotel.domain.RoomReservation;
import com.progmasters.hotel.dto.BookingCreateItem;
import com.progmasters.hotel.dto.BookingListItem;
import com.progmasters.hotel.repository.BookingRepository;
import com.progmasters.hotel.repository.RoomRepository;
import com.progmasters.hotel.repository.RoomReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {

    private BookingRepository bookingRepository;
    private RoomReservationRepository roomReservationRepository;
    private RoomRepository roomRepository;

    @Autowired
    public BookingService(RoomReservationRepository roomReservationRepository, BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomReservationRepository = roomReservationRepository;
        this.roomRepository = roomRepository;
    }

    public boolean saveBooking(BookingCreateItem bookingCreateItem) {
        boolean result = true;
        Booking booking = new Booking(bookingCreateItem);
        //TODO validation
        //Check the rooms are in the same hotel
        //Check the time, later than now, end is later then start (and not equal)

        //Check the rooms are free!
        for (Long roomId : bookingCreateItem.getRoomIdList()) {
            Optional<Room> optionalRoom = this.roomRepository.findById(roomId);
            if (optionalRoom.isPresent()) {
                Room room = optionalRoom.get();
                RoomReservation roomReservation = new RoomReservation(bookingCreateItem);
                roomReservation.setBooking(booking);
                roomReservation.setRoom(room);
                this.roomReservationRepository.save(roomReservation);
            } else {
                result = false;
            }
        }
        if (result) {
            this.bookingRepository.save(booking);
        }
        return result;
    }

    public List<BookingListItem> getBookingListItemList() {
        return bookingRepository.findAll().stream().map(BookingListItem::new).collect(Collectors.toList());
    }

}
