package com.progmasters.hotel.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.progmasters.hotel.domain.Booking;
import com.progmasters.hotel.domain.RoomReservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class BookingDetails {

    private Long id;
    private HotelShortItem hotel;
    private AccountDetails guest;
    private String remark;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private List<RoomShortListItem> reservedRooms = new ArrayList<>();
    private Integer numberOfGuests;
    @JsonFormat(pattern = "yyyy-MM-dd' 'HH:mm")
    private LocalDateTime dateOfBooking;
    private Double priceOfBooking;


    public BookingDetails() {
    }

    public BookingDetails(Booking booking) {
        this.id = booking.getId();
        this.hotel = new HotelShortItem(booking.getRoomReservations().get(0).getRoom().getHotel());
        this.guest = new AccountDetails(booking.getGuest());
        this.remark = booking.getRemark();
        this.startDate = booking.getRoomReservations().get(0).getStartDate();
        this.endDate = booking.getRoomReservations().get(0).getEndDate();
        for (RoomReservation roomReservation : booking.getRoomReservations()) {
            this.reservedRooms.add(new RoomShortListItem(roomReservation.getRoom()));
        }
        this.numberOfGuests = booking.getNumberOfGuests();
        this.dateOfBooking = booking.getDateOfBooking();
        this.priceOfBooking = booking.getPriceOfBooking();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public HotelShortItem getHotel() {
        return hotel;
    }

    public void setHotel(HotelShortItem hotel) {
        this.hotel = hotel;
    }

    public AccountDetails getGuest() {
        return guest;
    }

    public void setGuest(AccountDetails guest) {
        this.guest = guest;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
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

    public LocalDateTime getDateOfBooking() {
        return dateOfBooking;
    }

    public void setDateOfBooking(LocalDateTime dateOfBooking) {
        this.dateOfBooking = dateOfBooking;
    }

    public Double getPriceOfBooking() {
        return priceOfBooking;
    }

    public void setPriceOfBooking(Double priceOfBooking) {
        this.priceOfBooking = priceOfBooking;
    }

    public List<RoomShortListItem> getReservedRooms() {
        return reservedRooms;
    }

    public void setReservedRooms(List<RoomShortListItem> reservedRooms) {
        this.reservedRooms = reservedRooms;
    }
}
