import {Component, Input, OnInit} from '@angular/core';
import {BookingListItemForHotelModel} from "../../../models/bookingListItemForHotel.model";
import {BookingService} from "../../../services/booking.service";
import {PopupService} from "../../../services/popup.service";
import {MatDialog} from "@angular/material/dialog";
import {BookingDetailDialogComponent} from "../../booking-detail-dialog/booking-detail-dialog.component";

@Component({
  selector: 'future-hotel-bookings',
  templateUrl: './future-hotel-bookings.component.html',
  styleUrls: ['./future-hotel-bookings.component.css']
})
export class FutureHotelBookingsComponent implements OnInit {

  @Input() hotelId: number;
  futureBookingList: BookingListItemForHotelModel[];

  constructor(private bookingService: BookingService,
              private popupService: PopupService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (this.hotelId) {
      this.getFutureBookingList(this.hotelId);
    }
  }

  getFutureBookingList(hotelId: number) {
    this.bookingService.getFutureBookingListByHotel(hotelId).subscribe(
      (response: BookingListItemForHotelModel[]) => {
        this.futureBookingList = response;
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
