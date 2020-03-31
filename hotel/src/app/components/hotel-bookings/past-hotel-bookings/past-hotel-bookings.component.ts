import {Component, Input, OnInit} from '@angular/core';
import {BookingListItemForHotelModel} from "../../../models/bookingListItemForHotel.model";
import {BookingService} from "../../../services/booking.service";
import {PopupService} from "../../../services/popup.service";
import {MatDialog} from "@angular/material/dialog";
import {BookingDetailDialogComponent} from "../../booking-detail-dialog/booking-detail-dialog.component";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'past-hotel-bookings',
  templateUrl: './past-hotel-bookings.component.html',
  styleUrls: ['./past-hotel-bookings.component.css']
})
export class PastHotelBookingsComponent implements OnInit {

  @Input() hotelId: BehaviorSubject<number>;
  pastBookingList: BookingListItemForHotelModel[];

  constructor(private bookingService: BookingService,
              private popupService: PopupService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.hotelId.subscribe((id) => {
      if (id != 0) {
        this.getPastBookingList(id);
      }
    });
  }

  getPastBookingList(hotelId: number) {
    this.bookingService.getPastBookingListByHotel(hotelId).subscribe(
      (response: BookingListItemForHotelModel[]) => {
        this.pastBookingList = response;
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
