import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BookingCreateItemModel} from "../../../models/bookingCreateItem.model";
import {FormControl, FormGroup} from "@angular/forms";
import {BookingService} from "../../../services/booking.service";

@Component({
  selector: 'app-booking-form-dialog',
  templateUrl: './booking-form-dialog.component.html',
  styleUrls: ['./booking-form-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BookingFormDialogComponent implements OnInit {

  bookingForm: FormGroup;
  numberOfNights: number;
  priceOfBooking: number;

  constructor(public dialogRef: MatDialogRef<BookingFormDialogComponent>,
              private bookingService: BookingService,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.bookingForm = new FormGroup({
        'guestName': new FormControl(''),
        'remark': new FormControl(''),
        'aSZF': new FormControl(false),
      }
    );
  }

  ngOnInit(): void {
    this.numberOfNights = Math.round((this.data.endDate.getTime() - this.data.startDate.getTime()) / 86400000);
    this.priceOfBooking = 0;
    this.data.roomList.forEach((room) => {
        this.priceOfBooking += this.numberOfNights * room.pricePerNight;
      }
    );
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  onSubmit() {
    const input = {...this.bookingForm.value};
    const bookingData: BookingCreateItemModel = this.createBookingData(input);
    this.bookingService.createBooking(bookingData).subscribe(
      (next) => {
        console.log('it was successful')
      }, error => console.error(error),
    );
    this.closeDialog();
  }

  createBookingData = (input): BookingCreateItemModel => {
    return {
      guestName: input.guestName,
      remark: input.remark,
      numberOfGuests: this.data.numberOfGuests,
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      roomIdList: this.data.roomList.map(room => room.id)
    }
  }

}
