import {Component, Input, OnInit} from '@angular/core';
import {BookingService} from "../../../services/booking.service";
import {PopupService} from "../../../services/popup.service";
import {MatDialog} from "@angular/material/dialog";
import {BookingDetailDialogComponent} from "../../booking-detail-dialog/booking-detail-dialog.component";
import {BehaviorSubject} from "rxjs";
import {RoomBookingDataModel} from "../../../models/roomBookingData.model";
import {RoomService} from "../../../services/room.service";
import {Router} from "@angular/router";

const START_DAY_BEFORE_TODAY = 5;
const END_DAY_AFTER_TODAY = 24;
const DAY_STEP = 25;
const BACKGROUND_LIGHTESTGREY = 'hsl(0, 0%, 92%)';
const BACKGROUND_LIGHTGREY = 'hsl(0, 0%, 86%)';

@Component({
  selector: 'hotel-bookings-calendar',
  templateUrl: './hotel-bookings-calendar.component.html',
  styleUrls: ['./hotel-bookings-calendar.component.css']
})
export class HotelBookingsCalendarComponent implements OnInit {

  @Input() hotelId: BehaviorSubject<number>;
  roomBookingDataList: RoomBookingDataModel[];
  baseDate: Date;
  startDate: Date;
  endDate: Date;
  dayList;
  roomBookingTable;

  constructor(private bookingService: BookingService,
              private roomService: RoomService,
              private popupService: PopupService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.setBaseDateToday();
    this.initializeTable();
  }

  setBaseDateToday() {
    this.baseDate = new Date();
    this.baseDate.setHours(0, 0, 0, 0);
  }

  initializeTable() {
    this.setStartAndEndDate();
    this.hotelId.subscribe((id) => {
      if (id != 0) {
        this.getRoomBookingDataList(id, this.startDate, this.endDate);
      }
    });
  }

  setStartAndEndDate() {
    this.startDate = new Date(this.baseDate.getTime());
    this.endDate = new Date(this.baseDate.getTime());
    this.startDate.setDate(this.startDate.getDate() - START_DAY_BEFORE_TODAY);
    this.endDate.setDate(this.endDate.getDate() + END_DAY_AFTER_TODAY);
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

  goBack() {
    this.baseDate.setDate(this.baseDate.getDate() - DAY_STEP);
    this.initializeTable();
  }

  goActual() {
    this.setBaseDateToday();
    this.initializeTable();
  }

  goNext() {
    this.baseDate.setDate(this.baseDate.getDate() + DAY_STEP);
    this.initializeTable();
  }

  roomDetail(id: number): void {
    this.router.navigate(['/admin/hotel/room/', id])
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
          this.initializeTable();
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
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let actualDate = new Date(this.startDate.getTime()); actualDate.getTime() <= this.endDate.getTime(); actualDate.setDate(actualDate.getDate() + 1)) {
      let cellBackground = '';
      let isToday = false;
      if (actualDate.getDay() === 0 || actualDate.getDay() === 6) {
        cellBackground = BACKGROUND_LIGHTGREY;
      } else {
        cellBackground = 'hsl(0, 0%, 95%)';
      }
      if (actualDate.getTime() === today.getTime()) {
        isToday = true;
      }
      let dayData = {
        date: actualDate.getTime(),
        weekDayName: this.createWeekDayName(actualDate),
        dayDateString: this.createDayDateString(actualDate),
        backgroundColor: cellBackground,
        isToday: isToday,
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
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let actualDate = new Date(this.startDate.getTime()); actualDate.getTime() <= this.endDate.getTime(); actualDate.setDate(actualDate.getDate() + 1)) {
      let cellBackground = '';
      let isToday = false;
      if (actualDate.getDay() === 0 || actualDate.getDay() === 6) {
        cellBackground = BACKGROUND_LIGHTGREY;
      } else if (actualDate.getTime() < today.getTime()) {
        cellBackground = BACKGROUND_LIGHTESTGREY;
      } else {
        cellBackground = 'transparent';
      }
      if (actualDate.getTime() === today.getTime()) {
        isToday = true;
      }
      let roomDay = [null, null, null];
      actualDate.setHours(0, 0, 0, 0);
      for (let roomReservationData of roomBookingData.roomReservationDataList) {
        let roomDayData = {
          bookingId: roomReservationData.bookingId,
          guestName: roomReservationData.guestLastName + ' ' + roomReservationData.guestFirstName,
          numberOfGuests: roomReservationData.numberOfGuests,
          colour: 'hsl(' + (roomReservationData.bookingId * 21) % 360 + ', 50%, 50%)',
        };
        let roomReservationStartDate = new Date(roomReservationData.startDate);
        let roomReservationEndDate = new Date(roomReservationData.endDate);
        roomReservationStartDate.setHours(0, 0, 0, 0);
        roomReservationEndDate.setHours(0, 0, 0, 0);

        if (actualDate.getTime() === roomReservationStartDate.getTime()) {
          roomDay[2] = roomDayData;
        } else if (actualDate.getTime() > roomReservationStartDate.getTime() &&
          actualDate.getTime() < roomReservationEndDate.getTime()) {
          roomDay[0] = roomDayData;
          roomDay[1] = roomDayData;
          roomDay[2] = roomDayData;
        } else if (actualDate.getTime() === roomReservationEndDate.getTime()) {
          roomDay[0] = roomDayData;
        }
      }
      roomDayList.push({isToday: isToday, backgroundColor: cellBackground, roomDay: roomDay});
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
