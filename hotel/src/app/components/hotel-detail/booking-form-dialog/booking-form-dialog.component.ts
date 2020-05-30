import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BookingCreateItemModel} from "../../../models/bookingCreateItem.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BookingService} from "../../../services/booking.service";
import {BookingDetailsModel} from "../../../models/bookingDetails.model";
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";
import {RoomReservationDetailsModel} from "../../../models/roomReservationDetails.model";
import {RoomReservationShortItemModel} from "../../../models/roomReservationShortItem.model";

@Component({
  selector: 'app-booking-form-dialog',
  templateUrl: './booking-form-dialog.component.html',
  styleUrls: ['./booking-form-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BookingFormDialogComponent implements OnInit {

  bookingForm: FormGroup;
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
      'aSZF': new FormControl(false, Validators.requiredTrue),
      }
    );
  }

  ngOnInit(): void {

    this.loginService.authenticatedLoginDetailsModel.subscribe(
      (response) => {
        if (response !== null) {
          this.username = response.name;
        } else {
          this.router.navigate([''])
        }
      });

    this.priceOfBooking = 0;
    this.data.roomReservationList.forEach((roomReservation: RoomReservationDetailsModel) => {
        this.priceOfBooking += roomReservation.numberOfNights * roomReservation.room.pricePerNight;
      }
    );
  }

  closeDialog(dialogResult) {
    this.dialogRef.close(dialogResult);
  }

  onSubmit() {
    const input = {...this.bookingForm.value};
    const bookingData: BookingCreateItemModel = this.createBookingData(input);
    this.bookingService.createBooking(bookingData).subscribe(
      (bookingId: number) => {
        this.bookingService.bookingDetail(bookingId).subscribe(
          (response: BookingDetailsModel) => {
            this.bookingStatus = 'created';
            this.bookingDetails = this.parseDate(response);
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
      roomReservationList: this.createRoomReservationShortItemList(),
    }
  };

  createRoomReservationShortItemList() {
    let roomReservationList: RoomReservationShortItemModel[] = [];
    this.data.roomReservationList.forEach(roomReservation => {
      roomReservationList.push({
        startDate: roomReservation.startDate,
        endDate: roomReservation.endDate,
        roomId: roomReservation.room.id,
      });
    });
    return roomReservationList;
  }

  private parseDate(response: BookingDetailsModel): BookingDetailsModel {
    response.roomReservationList.forEach(roomReservation => {
      roomReservation.startDate = new Date(roomReservation.startDate);
      roomReservation.startDate.setHours(0, 0, 0, 0);
      roomReservation.endDate = new Date(roomReservation.endDate);
      roomReservation.endDate.setHours(0, 0, 0, 0);
    });
    return response;
  }
}
