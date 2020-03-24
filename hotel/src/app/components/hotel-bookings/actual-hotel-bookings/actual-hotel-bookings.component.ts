import {Component, Input, OnInit} from '@angular/core';
import {BookingListItemForHotelModel} from "../../../models/bookingListItemForHotel.model";
import {BookingService} from "../../../services/booking.service";
import {PopupService} from "../../../services/popup.service";
import {MatDialog} from "@angular/material/dialog";
import {BookingDetailDialogComponent} from "../../booking-detail-dialog/booking-detail-dialog.component";

@Component({
  selector: 'actual-hotel-bookings',
  templateUrl: './actual-hotel-bookings.component.html',
  styleUrls: ['./actual-hotel-bookings.component.css']
})
export class ActualHotelBookingsComponent implements OnInit {

  @Input() hotelId: number;
  currentBookingList: BookingListItemForHotelModel[];

  constructor(private bookingService: BookingService,
              private popupService: PopupService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (this.hotelId) {
      this.getCurrentBookingList(this.hotelId);
    }
  }

  getCurrentBookingList(hotelId: number) {
    this.bookingService.getCurrentBookingListByHotel(hotelId).subscribe(
      (response: BookingListItemForHotelModel[]) => {
        this.currentBookingList = response;
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

  deleteBooking(bookingId: number) {
    this.popupService.openConfirmPopup("Biztos törölni szeretnéd ezt a foglalást?")
      .afterClosed().subscribe(res => {
      if (res) {
        this.bookingService.deleteBooking(bookingId).subscribe(
          () => {
            this.ngOnInit();
          },
          error => console.warn(error),
        );
      }
    })
  }

}
