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
const ADDED_ROOM_RESERVATION = 'hsl(0, 0%, 65%)';

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
  modifiedRoomReservationData: RoomReservationDataModel;
  modifiedRoomReservationBaseStartDate: Date;
  modifiedRoomReservationBaseEndDate: Date;
  addedRoomReservationDataList: RoomReservationDataModel[] = [];


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
    this.resetModifiedData();
  }

  goActual() {
    this.setBaseDateToday();
    this.initializeTable();
    this.resetModifiedData();
  }

  goNext() {
    this.baseDate.setDate(this.baseDate.getDate() + DAY_STEP);
    this.initializeTable();
    this.resetModifiedData();
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
        weekDayName: actualDate.toLocaleDateString('hu-HU', {weekday: 'short'}),
        dayDateString: this.createDayDateString(actualDate),
        cellBackground: this.setDayListBackground(actualDate),
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
      roomDayList.push({isToday, cellDate, cellBackground, roomDay});
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

  private setBaseRoomDayData() {
    return {
      bookingId: null,
      roomReservationId: null,
      tooltip: '',
      color: 'transparent',
      cursor: 'cell',
      blinking: false,
    }
  }

  private setReservedRoomDayData(roomReservationData: RoomReservationDataModel, actualDate: Date) {
    return {
      bookingId: roomReservationData.bookingId,
      roomReservationId: roomReservationData.roomReservationId,
      tooltip: this.getTooltipText(roomReservationData),
      color: this.setReservationColor(roomReservationData.bookingId),
      cursor: 'move',
      blinking: false,
    };
  }

  private getTooltipText(roomReservationData: RoomReservationDataModel) {
    return roomReservationData.guestLastName + ' ' + roomReservationData.guestFirstName + ' - ' + roomReservationData.numberOfGuests + " fő";
  }

  private setReservationColor(bookingId: number) {
    return 'hsl(' + (bookingId * 21) % 360 + ', 30%, 55%)'
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
    let cellBackground;
    if (actualDate.getDay() === 0 || actualDate.getDay() === 6) {
      cellBackground = WEEKEND_BACKGROUND;
    } else {
      cellBackground = DAY_LIST_BACKGROUND;
    }
    return cellBackground;
  }

  actionMouseDown(roomId: number, roomReservationId: number, actionDate: Date) {
    if (!this.actionType) {
      this.actionStartDate = actionDate;

      this.roomBookingDataList.forEach(roomBookingData => {
        if (roomBookingData.roomId === roomId) {
          this.modifiedRoomBookingData = roomBookingData;
          if (this.addedRoomReservationDataList.length > 0) {
            if (!roomReservationId) {
              this.actionType = 'add';
              this.modifiedRoomReservationData = {
                roomReservationId: -1,
                bookingId: null,
                guestFirstName: '',
                guestLastName: '',
                startDate: null,
                endDate: null,
                numberOfGuests: null,
              };
              this.modifiedRoomBookingData.roomReservationDataList.push(this.modifiedRoomReservationData);
            }
          } else if (!roomReservationId) {
            this.actionType = 'add';
            this.modifiedRoomReservationData = {
              roomReservationId: -1,
              bookingId: null,
              guestFirstName: '',
              guestLastName: '',
              startDate: null,
              endDate: null,
              numberOfGuests: null,
            };
            this.modifiedRoomBookingData.roomReservationDataList.push(this.modifiedRoomReservationData);
          } else {
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
            this.moveModifiedRoomReservationToBackInList();
          }
        }
      });
    } else if (this.actionType) {
      this.actionMouseUp(actionDate);
    }
  }

  moveModifiedRoomReservationToBackInList() {
    const index = this.modifiedRoomBookingData.roomReservationDataList.indexOf(this.modifiedRoomReservationData);
    const removedItem = this.modifiedRoomBookingData.roomReservationDataList.splice(index, 1);
    this.modifiedRoomBookingData.roomReservationDataList.push(removedItem[0]);
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
      } else if (this.actionType === 'add') {
        if (this.actionStartDate.getTime() < actionActualDate.getTime()) {
          this.modifiedRoomReservationData.startDate = this.actionStartDate;
          this.modifiedRoomReservationData.endDate = actionActualDate;
        } else if (this.actionStartDate.getTime() > actionActualDate.getTime()) {
          this.modifiedRoomReservationData.startDate = actionActualDate;
          this.modifiedRoomReservationData.endDate = this.actionStartDate;
        } else {
          this.modifiedRoomReservationData.startDate = null;
          this.modifiedRoomReservationData.endDate = null;
        }
      }
      this.actualizeRoomBookingTableRow();
    }
  }

  actionMouseUp(actionDate: Date) {
    console.log('now is up')
    if (this.actionType && this.actionStartDate.getTime() !== actionDate.getTime()) {
      if (this.actionType === 'add') {
        this.addedRoomReservationDataList.push(this.modifiedRoomReservationData);
        this.popupService.openConfirmPopup("Szeretnél még foglalást hozzáadni?")
          .afterClosed().subscribe(res => {
          if (res) {
            this.modifiedRoomReservationData.roomReservationId = -2;
            this.actionType = ''
            this.actualizeRoomBookingTableRow();

          } else {



            this.actionType = '';
          }
        });
      } else {
        this.updateRoomReservation();
        this.actionType = '';
      }
    } else {
      this.actionType = '';
    }
    this.actionStartDate = null;
  }

  private resetModifiedData() {
    this.modifiedRoomBookingData = null;
    this.modifiedRoomReservationData = null;
    this.modifiedRoomReservationBaseStartDate = null;
    this.modifiedRoomReservationBaseEndDate = null;
    this.addedRoomReservationDataList = [];
  }

  private actualizeRoomBookingTableRow() {
    this.roomBookingTable.forEach(roomBookingTableRow => {
      if (roomBookingTableRow.roomId === this.modifiedRoomBookingData.roomId) {

        roomBookingTableRow.roomDayList.forEach(roomDayData => {
          let actualDate = roomDayData.cellDate;

          for (let i = 0; i < 3; i++) {
            roomDayData.roomDay[i].color = 'transparent';
            roomDayData.roomDay[i].cursor = 'cell';
          }

          for (let roomReservationData of this.modifiedRoomBookingData.roomReservationDataList) {

            if (roomReservationData.roomReservationId < 0) {
              if (actualDate.getTime() === roomReservationData.startDate.getTime()) {
                roomDayData.roomDay[2].color = ADDED_ROOM_RESERVATION;
                if (roomReservationData.roomReservationId === -2) roomDayData.roomDay[2].blinking = true;
              } else if (actualDate.getTime() > roomReservationData.startDate.getTime() &&
                actualDate.getTime() < roomReservationData.endDate.getTime()) {
                for (let i = 0; i < 3; i++) {
                  roomDayData.roomDay[i].color = ADDED_ROOM_RESERVATION;
                  if (roomReservationData.roomReservationId === -2) roomDayData.roomDay[i].blinking = true;
                }
              } else if (actualDate.getTime() === roomReservationData.endDate.getTime()) {
                roomDayData.roomDay[0].color = ADDED_ROOM_RESERVATION;
                if (roomReservationData.roomReservationId === -2) roomDayData.roomDay[0].blinking = true;
              }
            } else {
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
          }
        });
      }
    });
  }

  private updateRoomReservation() {
    this.popupService.openConfirmPopup("Módosítani szeretnéd a szoba foglalást?")
      .afterClosed().subscribe(res => {
      if (res) {
        let roomReservationsToModifiedBooking = this.getRoomReservationsToModifiedBooking();
        if (roomReservationsToModifiedBooking.length > 1) {
          this.popupService.openConfirmPopup("A foglaláshoz több szoba is tartozik!\nMindegyiket módosítani szeretnéd?")
            .afterClosed().subscribe(res => {
            if (res) {
              roomReservationsToModifiedBooking.forEach(modifiedRoomReservation => {
                modifiedRoomReservation.startDate = this.modifiedRoomReservationData.startDate;
                modifiedRoomReservation.endDate = this.modifiedRoomReservationData.endDate;
              });
              this.roomReservationService.updateAllRoomReservationInBooking(roomReservationsToModifiedBooking).subscribe(
                (response) => {
                  this.initializeTable();
                  this.resetModifiedData();
                },
                error => {
                  this.popupService.openConfirmPopup("Sikertelen módosítás!");
                  this.initializeTable();
                  this.resetModifiedData();
                },
              );
            } else {
              this.roomReservationService.updateRoomReservation(this.modifiedRoomReservationData).subscribe(
                (response) => {
                  this.initializeTable();
                  this.resetModifiedData();
                },
                error => {
                  this.popupService.openConfirmPopup("Sikertelen módosítás!");
                  this.initializeTable();
                  this.resetModifiedData();
                },
              );
            }
          });
        } else {
          this.roomReservationService.updateRoomReservation(this.modifiedRoomReservationData).subscribe(
            (response) => {
              this.initializeTable();
              this.resetModifiedData();
            },
            error => {
              this.popupService.openConfirmPopup("Sikertelen módosítás!");
              this.initializeTable();
              this.resetModifiedData();
            },
          );
        }
      } else {
        this.initializeTable()
        this.resetModifiedData();
      }
    })
  }

  getRoomReservationsToModifiedBooking(): RoomReservationDataModel[]{
    let roomReservationsToModifiedBooking: RoomReservationDataModel[] = [];
    this.roomBookingDataList.forEach(roomBookingData => {
      roomBookingData.roomReservationDataList.forEach(roomReservationData => {
        if (roomReservationData.bookingId === this.modifiedRoomReservationData.bookingId) {
          roomReservationsToModifiedBooking.push(roomReservationData);
        }
      });
    });
    return roomReservationsToModifiedBooking;
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
