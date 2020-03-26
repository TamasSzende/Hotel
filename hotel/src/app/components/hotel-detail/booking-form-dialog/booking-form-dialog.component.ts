import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BookingCreateItemModel} from "../../../models/bookingCreateItem.model";
import {FormControl, FormGroup} from "@angular/forms";
import {BookingService} from "../../../services/booking.service";
import {BookingDetailsModel} from "../../../models/bookingDetails.model";
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";

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
  bookingDetails: BookingDetailsModel;
  bookingStatus: string = 'booking';
  username: string;

  constructor(public dialogRef: MatDialogRef<BookingFormDialogComponent>,
              private bookingService: BookingService,
              private loginService: LoginService,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.bookingForm = new FormGroup({
        'remark': new FormControl(''),
        'aSZF': new FormControl(false),
      }
    );
  }

  ngOnInit(): void {

    this.loginService.authenticatedLoginDetailsModel.subscribe(
      (response) => {
        if (response !== null) {
          this.username = response.name;
        } else {
          this.router.navigate(['/login'])
        }
      });

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
      (bookingId: number) => {
        this.bookingService.bookingDetail(bookingId).subscribe(
          (response: BookingDetailsModel) => {
            this.bookingStatus = 'created';
            this.bookingDetails = response;
            this.numberOfNights = Math.round((response.endDate.getTime() - response.startDate.getTime()) / 86400000);
          }, error => {
            this.bookingStatus = 'failed';
          }
        )
      }, error => {
        this.bookingStatus = 'failed';
      },
    );
  }

  createBookingData = (input): BookingCreateItemModel => {
    return {
      guestAccountName: this.username,
      remark: input.remark,
      numberOfGuests: this.data.numberOfGuests,
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      roomIdList: this.data.roomList.map(room => room.id)
    }
  };

}
