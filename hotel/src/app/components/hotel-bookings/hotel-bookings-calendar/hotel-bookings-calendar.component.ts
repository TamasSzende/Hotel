import {Component, Input, OnInit} from '@angular/core';
import {BookingService} from "../../../services/booking.service";
import {PopupService} from "../../../services/popup.service";
import {MatDialog} from "@angular/material/dialog";
import {BookingDetailDialogComponent} from "../../booking-detail-dialog/booking-detail-dialog.component";
import {BehaviorSubject} from "rxjs";
import {RoomBookingDataModel} from "../../../models/roomBookingData.model";
import {RoomService} from "../../../services/room.service";
import {Router} from "@angular/router";
import {RoomReservationDataModel} from "../../../models/roomReservationData.model";
import {RoomReservationService} from "../../../services/roomReservation.service";

const START_DAY_BEFORE_TODAY = 5;
const END_DAY_AFTER_TODAY = 23;
const DAY_STEP = 24;

const PAST_BACKGROUND = 'hsl(0, 0%, 92%)';
const WEEKEND_BACKGROUND = 'hsl(0, 0%, 86%)';
const DAY_LIST_BACKGROUND = 'hsl(0, 0%, 95%)';

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
  today: Date;
  dayList;
  roomBookingTable;

  actionType = '';
  actionStartDate: Date;
  modifiedRoomBookingData: RoomBookingDataModel;
  modifiedRoomReservationData: RoomReservationDataModel
  modifiedRoomReservationBaseStartDate: Date
  modifiedRoomReservationBaseEndDate: Date


  constructor(private bookingService: BookingService,
              private roomService: RoomService,
              private roomReservationService: RoomReservationService,
              private popupService: PopupService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.setToday();
    this.setBaseDateToday();
    this.initializeTable();
  }


  setToday() {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
  }

  setBaseDateToday() {
    this.baseDate = new Date(this.today.getTime());
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
        this.convertDateStringToDateInRoomBookingDataList();
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
    if (bookingId) {
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
  }

  private createCalenderTable(roomBookingDataList: RoomBookingDataModel[]) {
    this.createDayList();
    this.createRoomBookingTable();
  }

  private createDayList() {
    this.dayList = [];
    for (let actualDate = new Date(this.startDate.getTime()); actualDate.getTime() <= this.endDate.getTime(); actualDate.setDate(actualDate.getDate() + 1)) {

      let dayData = {
        date: actualDate.getTime(),
        weekDayName: this.createWeekDayName(actualDate),
        dayDateString: this.createDayDateString(actualDate),
        backgroundColor: this.setDayListBackground(actualDate),
        isToday: (actualDate.getTime() === this.today.getTime()),
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

      let isToday = (actualDate.getTime() === this.today.getTime());
      let cellDate = new Date(actualDate.getTime());
      let cellBackground = this.setCellBackground(actualDate);
      let roomDay = this.createRoomDayData(roomBookingData.roomReservationDataList, actualDate);

      roomDayList.push({isToday: isToday, cellDate: cellDate, backgroundColor: cellBackground, roomDay: roomDay});
    }
    return roomDayList;
  }

  private createRoomDayData(roomReservationDataList: RoomReservationDataModel[], actualDate: Date) {

    let roomDay = [this.setBaseRoomDayData(), this.setBaseRoomDayData(), this.setBaseRoomDayData()];

    for (let roomReservationData of roomReservationDataList) {

      if (actualDate.getTime() === roomReservationData.startDate.getTime()) {
        roomDay[2] = this.setReservedRoomDayData(roomReservationData, actualDate);
        roomDay[2].cursor = 'e-resize'
      } else if (actualDate.getTime() > roomReservationData.startDate.getTime() &&
        actualDate.getTime() < roomReservationData.endDate.getTime()) {
        roomDay[0] = this.setReservedRoomDayData(roomReservationData, actualDate);
        roomDay[1] = this.setReservedRoomDayData(roomReservationData, actualDate);
        roomDay[2] = this.setReservedRoomDayData(roomReservationData, actualDate);
      } else if (actualDate.getTime() === roomReservationData.endDate.getTime()) {
        roomDay[0] = this.setReservedRoomDayData(roomReservationData, actualDate);
        roomDay[0].cursor = 'e-resize'
      }
    }
    return roomDay;
  }

  private setReservedRoomDayData(roomReservationData: RoomReservationDataModel, actualDate: Date) {
    return {
      bookingId: roomReservationData.bookingId,
      roomReservationId: roomReservationData.roomReservationId,
      tooltip: this.getTooltipText(roomReservationData),
      color: this.setReservationColor(roomReservationData.bookingId),
      cursor: 'move',
    };
  }

  private getTooltipText(roomReservationData: RoomReservationDataModel) {
    return roomReservationData.guestLastName + ' ' + roomReservationData.guestFirstName + ' - ' + roomReservationData.numberOfGuests + " fő";
  }

  private setReservationColor(bookingId: number) {
    return 'hsl(' + (bookingId * 21) % 360 + ', 50%, 50%)'
  }

  private setBaseRoomDayData() {
    return {
      bookingId: null,
      roomReservationId: null,
      tooltip: '',
      color: 'transparent',
      cursor: 'default',
    }
  }

  private setCellBackground(actualDate: Date) {
    let cellBackground = 'transparent';
    if (actualDate.getDay() === 0 || actualDate.getDay() === 6) {
      cellBackground = WEEKEND_BACKGROUND;
    } else if (actualDate.getTime() < this.today.getTime()) {
      cellBackground = PAST_BACKGROUND;
    }
    return cellBackground;
  }

  private setDayListBackground(actualDate: Date) {
    let cellBackground = 'transparent';
    if (actualDate.getDay() === 0 || actualDate.getDay() === 6) {
      cellBackground = WEEKEND_BACKGROUND;
    } else {
      cellBackground = DAY_LIST_BACKGROUND;
    }
    return cellBackground;
  }

  actionMouseDown(roomId: number, roomReservationId: number, actionDate: Date) {
    if (!this.actionType && roomReservationId) {
      this.actionStartDate = actionDate;

      this.roomBookingDataList.forEach(roomBookingData => {
        if (roomBookingData.roomId === roomId) {
          this.modifiedRoomBookingData = roomBookingData;
          this.modifiedRoomBookingData.roomReservationDataList.forEach(roomReservationData => {
            if (roomReservationData.roomReservationId === roomReservationId) {
              this.modifiedRoomReservationData = roomReservationData;
              this.modifiedRoomReservationBaseStartDate = new Date(roomReservationData.startDate);
              this.modifiedRoomReservationBaseEndDate = new Date(roomReservationData.endDate);
              if (this.actionStartDate.getTime() === this.modifiedRoomReservationData.startDate.getTime()) {
                this.actionType = 'changeStarDate';
              } else if (this.actionStartDate.getTime() === this.modifiedRoomReservationData.endDate.getTime()) {
                this.actionType = 'changeEndDate';
              } else {
                this.actionType = 'move';
              }
            }
          });
        }
      });
    } else if (this.actionType) {
      this.actionMouseUp(actionDate);
    }
  }

  actionMouseEnter(roomId: number, actionActualDate: Date) {
    if (this.actionType) {
      let actionDifference = actionActualDate.getTime() - this.actionStartDate.getTime();
      if (this.actionType === 'move') {
        this.modifiedRoomReservationData.startDate.setTime(this.modifiedRoomReservationBaseStartDate.getTime() + actionDifference);
        this.modifiedRoomReservationData.endDate.setTime(this.modifiedRoomReservationBaseEndDate.getTime() + actionDifference);
      } else if (this.actionType === 'changeStarDate') {
        this.modifiedRoomReservationData.startDate.setTime(this.modifiedRoomReservationBaseStartDate.getTime() + actionDifference);
      } else if (this.actionType === 'changeEndDate') {
        this.modifiedRoomReservationData.endDate.setTime(this.modifiedRoomReservationBaseEndDate.getTime() + actionDifference);
      }
      this.actualizeRoomBookingTableRow();
    }
  }

  actionMouseUp(actionDate: Date) {
    if (this.actionType && this.actionStartDate.getTime() !== actionDate.getTime()) {
      this.updateRoomReservation();
    }
    this.actionType = '';
    this.actionStartDate = null;
  }

  private resetModifiedData() {
    this.modifiedRoomBookingData = null;
    this.modifiedRoomReservationData = null;
    this.modifiedRoomReservationBaseStartDate = null;
    this.modifiedRoomReservationBaseEndDate = null;
  }

  private actualizeRoomBookingTableRow() {
    this.roomBookingTable.forEach(roomBookingTableRow => {
      if (roomBookingTableRow.roomId === this.modifiedRoomBookingData.roomId) {

        roomBookingTableRow.roomDayList.forEach(roomDayData => {
          let actualDate = roomDayData.cellDate;

          for (let i = 0; i < 3; i++) {
            roomDayData.roomDay[i].color = 'transparent';
            roomDayData.roomDay[i].cursor = 'default';
          }

          for (let roomReservationData of this.modifiedRoomBookingData.roomReservationDataList) {

            if (actualDate.getTime() === roomReservationData.startDate.getTime()) {
              roomDayData.roomDay[2].color = this.setReservationColor(roomReservationData.bookingId);
              roomDayData.roomDay[2].cursor = 'e-resize';
            } else if (actualDate.getTime() > roomReservationData.startDate.getTime() &&
              actualDate.getTime() < roomReservationData.endDate.getTime()) {
              for (let i = 0; i < 3; i++) {
                roomDayData.roomDay[i].color = this.setReservationColor(roomReservationData.bookingId);
                roomDayData.roomDay[i].cursor = 'move';
              }
            } else if (actualDate.getTime() === roomReservationData.endDate.getTime()) {
              roomDayData.roomDay[0].color = this.setReservationColor(roomReservationData.bookingId);
              roomDayData.roomDay[0].cursor = 'e-resize';
            }
          }
        });
      }
    });
  }

  private updateRoomReservation() {
    this.popupService.openConfirmPopup("Módosítani szeretnéd a szoba foglalást?")
      .afterClosed().subscribe(res => {
      if (res) {
        this.roomReservationService.updateRoomReservation(this.modifiedRoomReservationData).subscribe(
          (response) => {
            this.initializeTable();
            this.resetModifiedData();
          },
          error => console.warn(error),
        );
      } else {
        this.initializeTable()
        this.resetModifiedData();
      }
    })
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


  private convertDateStringToDateInRoomBookingDataList() {
    this.roomBookingDataList.forEach(roomBookingData => {
      roomBookingData.roomReservationDataList.forEach(roomReservationData => {
        roomReservationData.startDate = new Date(roomReservationData.startDate);
        roomReservationData.startDate.setHours(0, 0, 0, 0);
        roomReservationData.endDate = new Date(roomReservationData.endDate);
        roomReservationData.endDate.setHours(0, 0, 0, 0);
      });
    });
  }
}
