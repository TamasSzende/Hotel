import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BookingDetailsModel} from "../../models/bookingDetails.model";
import {BookingService} from "../../services/booking.service";
import {PopupService} from "../../services/popup.service";

@Component({
  selector: 'app-booking-detail-dialog',
  templateUrl: './booking-detail-dialog.component.html',
  styleUrls: ['./booking-detail-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BookingDetailDialogComponent implements OnInit {

  numberOfNights: number;
  bookingDetails: BookingDetailsModel;


  constructor(public dialogRef: MatDialogRef<BookingDetailDialogComponent>,
              private bookingService: BookingService,
              private popupService: PopupService,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit(): void {
    this.bookingService.bookingDetail(this.data).subscribe(
      (response: BookingDetailsModel) => {
        this.bookingDetails = response;
        this.numberOfNights = Math.round((this.bookingDetails.endDate.getTime() - this.bookingDetails.startDate.getTime()) / 86400000);
        console.log(this.numberOfNights);
      }, error => {
        console.log(error);
      }
    );
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  deleteBooking() {
    this.popupService.openConfirmPopup("Biztos törölni szeretnéd ezt a foglalást?")
      .afterClosed().subscribe(response => {
      if (response) {
        this.bookingService.deleteBooking(this.bookingDetails.id).subscribe(
          () => {
            this.closeDialog();
          },
          error => console.warn(error),
        );
      }
    })
  }

}
