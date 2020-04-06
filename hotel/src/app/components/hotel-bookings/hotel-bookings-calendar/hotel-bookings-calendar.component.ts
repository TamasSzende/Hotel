import {Component, Input, OnInit} from '@angular/core';
import {BookingService} from "../../../services/booking.service";
import {PopupService} from "../../../services/popup.service";
import {MatDialog} from "@angular/material/dialog";
import {BookingDetailDialogComponent} from "../../booking-detail-dialog/booking-detail-dialog.component";
import {BehaviorSubject} from "rxjs";
import {RoomBookingDataModel} from "../../../models/roomBookingData.model";
import {RoomService} from "../../../services/room.service";

const START_DAY_BEFORE_TODAY = 5;
const END_DAY_AFTER_TODAY = 20;

@Component({
  selector: 'hotel-bookings-calendar',
  templateUrl: './hotel-bookings-calendar.component.html',
  styleUrls: ['./hotel-bookings-calendar.component.css']
})
export class HotelBookingsCalendarComponent implements OnInit {

  @Input() hotelId: BehaviorSubject<number>;
  roomBookingDataList: RoomBookingDataModel[];
  startDate: Date = new Date();
  endDate: Date = new Date();
  dayList;
  roomBookingTable;

  constructor(private bookingService: BookingService,
              private roomService: RoomService,
              private popupService: PopupService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.setStartAndEndDate();
    this.hotelId.subscribe((id) => {
      if (id != 0) {
        this.getRoomBookingDataList(id, this.startDate, this.endDate);
      }
    });
  }

  setStartAndEndDate() {
    let today = new Date();
    this.startDate.setDate(today.getDate() - START_DAY_BEFORE_TODAY);
    this.endDate.setDate(today.getDate() + END_DAY_AFTER_TODAY);
  }

  getRoomBookingDataList(hotelId: number, startDate: Date, endDate: Date) {
    this.roomService.getRoomBookingData(hotelId, this.startDate, this.endDate).subscribe(
      (response: RoomBookingDataModel[]) => {
        this.roomBookingDataList = response;
        this.createCalenderTable(this.roomBookingDataList);
      },
      error => console.warn(error)
    );
  }

  bookingDetails(bookingId: number) {
    let dialogRef = this.dialog.open(BookingDetailDialogComponent, {
      height: '600px',
      width: '800px',
      data: bookingId,
    });
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.ngOnInit();
        }
      }
    )
  }

  private createCalenderTable(roomBookingDataList: RoomBookingDataModel[]) {
    this.createDayList();
    this.createRoomBookingTable();
  }

  private createDayList() {
    this.dayList = [];
    for (let actualDate = new Date(this.startDate.getTime()); actualDate.getTime() <= this.endDate.getTime(); actualDate.setDate(actualDate.getDate() + 1)) {
      let dayData = {
        date: actualDate,
        weekDayName: this.createWeekDayName(actualDate),
        dayDateString: this.createDayDateString(actualDate),
      };
      this.dayList.push(dayData);
    }
  }

  private createRoomBookingTable() {
    this.roomBookingTable = [];
    for (let roomBookingData of this.roomBookingDataList) {
      let roomBookingTableRow = {
        roomId: roomBookingData.roomId,
        roomName: roomBookingData.roomName,
        roomDayList: this.createRoomDayList(roomBookingData),
      };
      this.roomBookingTable.push(roomBookingTableRow);
    }
  }

  private createRoomDayList(roomBookingData: RoomBookingDataModel) {
    let roomDayList = [];
    for (let actualDate = new Date(this.startDate.getTime()); actualDate.getTime() <= this.endDate.getTime(); actualDate.setDate(actualDate.getDate() + 1)) {
      let roomDay = {morning: null, noon: null, evening: null,};
      actualDate.setHours(0, 0, 0, 0);
      for (let roomReservationData of roomBookingData.roomReservationDataList) {
        let roomDayData = {
          bookingId: roomReservationData.bookingId,
          guestName: roomReservationData.guestFirstName + roomReservationData.guestLastName,
          numberOfGuests: roomReservationData.numberOfGuests,
          colour: 'X',
        };
        let roomReservationStartDate = new Date(roomReservationData.startDate);
        let roomReservationEndDate = new Date(roomReservationData.endDate);
        roomReservationStartDate.setHours(0, 0, 0, 0);
        roomReservationEndDate.setHours(0, 0, 0, 0);

        if (actualDate.getTime() === roomReservationStartDate.getTime()) {
          roomDay.evening = roomDayData;
        } else if (actualDate.getTime() > roomReservationStartDate.getTime() &&
          actualDate.getTime() < roomReservationEndDate.getTime()) {
          roomDay.morning = roomDayData;
          roomDay.noon = roomDayData;
          roomDay.evening = roomDayData;
        } else if (actualDate.getTime() === roomReservationEndDate.getTime()) {
          roomDay.morning = roomDayData;
        }
      }
      roomDayList.push(roomDay);
    }
    return roomDayList;
  }

  private createWeekDayName(date: Date) {
    switch (date.getDay()) {
      case 0:
        return "Vas";
      case 1:
        return "Hé";
      case 2:
        return "Ke";
      case 3:
        return "Sze";
      case 4:
        return "Csü";
      case 5:
        return "Pé";
      case 6:
        return "Szo";
    }
  }

  private createDayDateString(date: Date) {
    let result: string = '';
    let month = date.getMonth() + 1;
    if (month.toString().length === 1) {
      result += '0';
    }
    result += month + '.';
    if (date.getDate().toString().length === 1) {
      result += '0';
    }
    result += date.getDate();
    return result;
  }
}
