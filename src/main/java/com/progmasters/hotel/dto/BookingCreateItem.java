package com.progmasters.hotel.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.util.List;

public class BookingCreateItem {

    private String guestAccountName;
    private String remark;
    private Integer numberOfGuests;
    @JsonFormat(pattern = "yyyy. MM. dd.")
    private LocalDate startDate;
    @JsonFormat(pattern = "yyyy. MM. dd.")
    private LocalDate endDate;
    private List<Long> roomIdList;

    public BookingCreateItem() {
    }

    public String getGuestAccountName() {
        return guestAccountName;
    }

    public void setGuestAccountName(String guestAccountName) {
        this.guestAccountName = guestAccountName;
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
