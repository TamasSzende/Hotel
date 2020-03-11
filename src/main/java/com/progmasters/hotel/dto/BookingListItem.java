package com.progmasters.hotel.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.progmasters.hotel.domain.Booking;
import com.progmasters.hotel.domain.RoomReservation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class BookingListItem {

    private Long id;
    private String guestName;
    private List<RoomReservationDetails> roomReservations = new ArrayList<>();
    private Integer numberOfGuests;
    @JsonFormat(pattern = "yyyy-MM-dd' 'HH:mm")
    private LocalDateTime dateOfBooking;


    BookingListItem() {
    }

    public BookingListItem(Booking booking) {
        this.id = booking.getId();
        this.guestName = booking.getGuestName();
        for (RoomReservation roomReservation : booking.getRoomReservations()) {
            this.roomReservations.add(new RoomReservationDetails(roomReservation));
        }
        this.numberOfGuests = booking.getNumberOfGuests();
        this.dateOfBooking = booking.getDateOfBooking();
    }

    public Long getId() {
        return id;
    }

    public String getGuestName() {
        return guestName;
    }

    public List<RoomReservationDetails> getRoomReservations() {
        return roomReservations;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public LocalDateTime getDateOfBooking() {
        return dateOfBooking;
    }

    public void setDateOfBooking(LocalDateTime dateOfBooking) {
        this.dateOfBooking = dateOfBooking;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public void setRoomReservations(List<RoomReservationDetails> roomReservations) {
        this.roomReservations = roomReservations;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }
}
