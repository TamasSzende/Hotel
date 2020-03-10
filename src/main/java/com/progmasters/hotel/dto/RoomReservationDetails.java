package com.progmasters.hotel.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.progmasters.hotel.domain.RoomReservation;

import java.time.LocalDate;

public class RoomReservationDetails {

    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private RoomShortListItem room;

    RoomReservationDetails() {
    }

    public RoomReservationDetails(RoomReservation roomReservation) {
        this.id = roomReservation.getId();
        this.startDate = roomReservation.getStartDate();
        this.endDate = roomReservation.getEndDate();
        this.room = new RoomShortListItem(roomReservation.getRoom());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public RoomShortListItem getRoom() {
        return room;
    }

    public void setRoom(RoomShortListItem room) {
        this.room = room;
    }


}
