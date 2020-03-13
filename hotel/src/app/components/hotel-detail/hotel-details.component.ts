import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HotelService} from "../../services/hotel.service";
import {HotelDetailsModel} from "../../models/hotelDetails.model";
import {RoomService} from "../../services/room.service";
import {LoginService} from "../../services/login.service";
import {RoomListItemModel} from "../../models/roomListItem.model";
import {PopupService} from "../../services/popup.service";
import {FlatpickrOptions} from "ng2-flatpickr";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {BookingService} from "../../services/booking.service";
import {BookingFormDialogComponent} from "./booking-form-dialog/booking-form-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {RoomShortListItemModel} from "../../models/roomShortListItem.model";


@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent implements OnInit {

  hotel: HotelDetailsModel;
  hotelIdFromLogin: number;
  hotelIdFromRoute: string;

  bookingForm: FormGroup;
  flatpickrOptions: FlatpickrOptions;

  constructor(private  hotelService: HotelService, private roomService: RoomService,
              private bookingService: BookingService, private loginService: LoginService,
              private route: ActivatedRoute, private router: Router,
              private popupService: PopupService, private dialog: MatDialog) {
    this.flatpickrOptions = {
      mode: "range",
      minDate: "today",
      dateFormat: "Y-m-d",
    };

    this.bookingForm = new FormGroup({
      'numberOfGuests': new FormControl(null),
      'bookingDateRange': new FormControl(''),
      'roomIdList': new FormArray([]),
    });
  }

  ngOnInit(): void {

    this.hotelIdFromLogin = this.loginService.getHotelId();
    if (this.hotelIdFromLogin) {
      this.getHotelDetail(String(this.hotelIdFromLogin));
    } else {
      this.route.paramMap.subscribe(
        paramMap => {
          const paramMapId = paramMap.get('id');
          if (paramMapId) {
            this.hotelIdFromRoute = paramMapId;
            this.getHotelDetail(this.hotelIdFromRoute);
          }
        },
        error => console.warn(error),
      );
    }
  }

  getHotelDetail = (hotelId: string) => {
    this.hotelService.hotelDetail(hotelId).subscribe(
      (response: HotelDetailsModel) => {
        this.hotel = response;
        this.createRoomBookingFormArray();
      }
    );
  };

  createRoomInHotel() {
    this.router.navigate(['/admin/hotel/create-room'])
  }

  updateHotel() {
    this.router.navigate(['/admin/hotel-update'])
  }

  //TODO lechekkolni, hogy van-e a szobához elkövetkező foglalás!!
  deleteRoom(id: number) {
    this.popupService.openConfirmPopup("Are you sure to delete this record?")
      .afterClosed().subscribe(res => {
      if (res) {
        this.roomService.deleteRoom(id).subscribe(
          (response: RoomListItemModel[]) => {
            this.hotel.rooms = response;
            this.clearRoomBookingFormArray();
            this.createRoomBookingFormArray();
          },
          error => console.warn(error),
        );
      }
    })
  }

  updateRoom(id: number): void {
    this.router.navigate(['/admin/hotel/update-room/', id])
  }

  roomDetail(id: number): void {
    this.router.navigate(['/admin/hotel/room/', id])
  }

  backToHotelList() {
    this.router.navigate(['/hotel'])
  }

  makeBooking() {
    const input = {...this.bookingForm.value};
    let dialogRef = this.dialog.open(BookingFormDialogComponent, {
      height: '600px',
      width: '800px',
      data: this.createBookingFormDialogData(input),
    });
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.router.navigate(['/hotel']);
        }
      }
    )
  }

  createReservedRoomArrayToSend(): RoomShortListItemModel[] {
    const result: RoomShortListItemModel[] = [];
    this.bookingForm.value.roomIdList.forEach((value, index) => {
        if (value) {
          const room = {
            id: this.hotel.rooms[index].id,
            roomName: this.hotel.rooms[index].roomName,
            roomType: this.hotel.rooms[index].roomType,
            numberOfBeds: this.hotel.rooms[index].numberOfBeds,
            pricePerNight: this.hotel.rooms[index].pricePerNight,
          };
          result.push(room)
        }
      }
    );
    return result;
  }

  createBookingFormDialogData(input) {
    return {
      hotel: this.createHotelDataToSend(),
      numberOfGuests: input.numberOfGuests,
      startDate: input.bookingDateRange[0],
      endDate: input.bookingDateRange[1],
      roomList: this.createReservedRoomArrayToSend(),
    }
  }

  createHotelDataToSend() {
    return {
      name: this.hotel.name,
      hotelType: this.hotel.hotelType,
      postalCode: this.hotel.postalCode,
      city: this.hotel.city,
      streetAddress: this.hotel.streetAddress,
    }
  }

  private createRoomBookingFormArray() {
    this.hotel.rooms.forEach(() => {
        const control = new FormControl(false);
        (this.bookingForm.controls.roomIdList as FormArray).push(control);
      }
    );
  }

  private clearRoomBookingFormArray() {
    while ((this.bookingForm.controls.roomIdList as FormArray).length !== 0) {
      (this.bookingForm.controls.roomIdList as FormArray).removeAt(0)
    }
  }

}
