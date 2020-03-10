package com.progmasters.hotel.dto;

import java.time.LocalDate;
import java.util.List;

public class BookingCreateItem {

    private String guestName;
    private String remark;
    private Integer numberOfGuests;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<Long> roomIdList;

    public BookingCreateItem() {
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

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
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

    public List<Long> getRoomIdList() {
        return roomIdList;
    }

    public void setRoomIdList(List<Long> roomIdList) {
        this.roomIdList = roomIdList;
    }
}
