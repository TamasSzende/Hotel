package com.progmasters.hotel.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.progmasters.hotel.domain.RoomReservation;

import java.time.LocalDate;

public class RoomReservationData {

    private Long bookingId;

    private String guestFirstName;

    private String guestLastName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private Integer numberOfGuests;

    public RoomReservationData() {
    }

    public RoomReservationData(RoomReservation roomReservation) {
        this.bookingId = roomReservation.getBooking().getId();
        this.guestFirstName = roomReservation.getBooking().getGuest().getFirstname();
        this.guestLastName = roomReservation.getBooking().getGuest().getLastname();
        this.startDate = roomReservation.getStartDate();
        this.endDate = roomReservation.getEndDate();
        this.numberOfGuests = roomReservation.getBooking().getNumberOfGuests();
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getGuestFirstName() {
        return guestFirstName;
    }

    public void setGuestFirstName(String guestFirstName) {
        this.guestFirstName = guestFirstName;
    }

    public String getGuestLastName() {
        return guestLastName;
    }

    public void setGuestLastName(String guestLastName) {
        this.guestLastName = guestLastName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }
}
