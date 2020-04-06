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

  constructor(private bookingService: BookingService,
              private roomService: RoomService,
              private popupService: PopupService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.hotelId.subscribe((id) => {
      if (id != 0) {
        this.getRoomBookingDataList(id);
      }
    });
  }

  getRoomBookingDataList(hotelId: number) {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - START_DAY_BEFORE_TODAY);

    let endDate = new Date();
    endDate.setDate(endDate.getDate() + END_DAY_AFTER_TODAY);

    this.roomService.getRoomBookingData(hotelId, startDate, endDate).subscribe(
      (response: RoomBookingDataModel[]) => {
        this.roomBookingDataList = response;
        console.log(this.roomBookingDataList);
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


}
