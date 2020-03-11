package com.progmasters.hotel.domain;

import com.progmasters.hotel.dto.BookingCreateItem;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "guest_name")
    private String guestName;

    @Column(name = "remark", columnDefinition = "TEXT")
    private String remark;

    @Column(name = "date_of_booking")
    private LocalDateTime dateOfBooking;

    @OneToMany(mappedBy = "booking") //, fetch = FetchType.EAGER
    private List<RoomReservation> roomReservations = new ArrayList<>();

    @Column(name = "number_of_guests")
    private Integer numberOfGuests;

    Booking() {
    }

    public Booking(BookingCreateItem bookingCreateItem) {
        this.guestName = bookingCreateItem.getGuestName();
        this.remark = bookingCreateItem.getRemark();
        this.numberOfGuests = bookingCreateItem.getNumberOfGuests();
        this.dateOfBooking = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getGuestName() {
        return guestName;
    }

    public String getRemark() {
        return remark;
    }

    public LocalDateTime getDateOfBooking() {
        return dateOfBooking;
    }

    public List<RoomReservation> getRoomReservations() {
        return roomReservations;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
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

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public void setRoomReservations(List<RoomReservation> roomReservations) {
        this.roomReservations = roomReservations;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }
}
