package com.progmasters.hotel.domain;


import com.progmasters.hotel.dto.BookingCreateItem;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "room_reservation")
public class RoomReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    RoomReservation() {
    }

    public RoomReservation(LocalDate startDate, LocalDate endDate, Room room, Booking booking) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.room = room;
        this.booking = booking;
    }

    public RoomReservation(BookingCreateItem bookingCreateItem) {
        this.startDate = bookingCreateItem.getStartDate();
        this.endDate = bookingCreateItem.getEndDate();
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

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }


}
