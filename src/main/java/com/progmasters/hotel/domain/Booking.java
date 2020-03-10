package com.progmasters.hotel.domain;

import com.progmasters.hotel.dto.BookingCreateItem;

import javax.persistence.*;
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

    @OneToMany(mappedBy = "booking") //, fetch = FetchType.EAGER
    private List<RoomReservation> roomReservations = new ArrayList<>();

    @Column(name = "number_of_guests")
    private Integer numberOfGuests;

    Booking() {
    }

    public Booking(String guestName, String remark, List<RoomReservation> roomReservations, Integer numberOfGuests) {
        this.guestName = guestName;
        this.remark = remark;
        this.roomReservations = roomReservations;
        this.numberOfGuests = numberOfGuests;
    }

    public Booking(BookingCreateItem bookingCreateItem) {
        this.guestName = bookingCreateItem.getGuestName();
        this.remark = bookingCreateItem.getRemark();
        this.numberOfGuests = bookingCreateItem.getNumberOfGuests();
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

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public List<RoomReservation> getRoomReservations() {
        return roomReservations;
    }

    public void setRoomReservations(List<RoomReservation> roomReservations) {
        this.roomReservations = roomReservations;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }


}
