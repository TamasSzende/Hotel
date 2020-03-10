package com.progmasters.hotel.dto;

import com.progmasters.hotel.domain.Booking;
import com.progmasters.hotel.domain.RoomReservation;

import java.util.ArrayList;
import java.util.List;

public class BookingListItem {

    private Long id;
    private String guestName;
    private List<RoomReservationDetails> roomReservations = new ArrayList<>();
    private Integer numberOfGuests;

    BookingListItem() {
    }

    public BookingListItem(Booking booking) {
        this.id = booking.getId();
        this.guestName = booking.getGuestName();
        for (RoomReservation roomReservation : booking.getRoomReservations()) {
            this.roomReservations.add(new RoomReservationDetails(roomReservation));
        }
        this.numberOfGuests = booking.getNumberOfGuests();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public List<RoomReservationDetails> getRoomReservations() {
        return roomReservations;
    }

    public void setRoomReservations(List<RoomReservationDetails> roomReservations) {
        this.roomReservations = roomReservations;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }


}
