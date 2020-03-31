import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HotelService} from "../../services/hotel.service";
import {HotelDetailsModel} from "../../models/hotelDetails.model";
import {LoginService} from "../../services/login.service";
import {RoomListItemModel} from "../../models/roomListItem.model";
import {PopupService} from "../../services/popup.service";
import {FlatpickrOptions} from "ng2-flatpickr";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {BookingService} from "../../services/booking.service";
import {BookingFormDialogComponent} from "./booking-form-dialog/booking-form-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {RoomShortListItemModel} from "../../models/roomShortListItem.model";
import {RoomFormDataModel} from "../../models/roomFormData.model";
import {RoomFeatureTypeOptionModel} from "../../models/roomFeatureTypeOption.model";
import {getPublicId} from "../../utils/cloudinaryPublicIdHandler";
import {AuthenticatedLoginDetailsModel} from "../../models/authenticatedLoginDetails.model";
import {RoomService} from "../../services/room.service";


@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent implements OnInit {

  hotel: HotelDetailsModel;
  priceOfBooking: number;
  maxNumberOfGuest: number = 0;
  hotelIdFromLogin: number;
  hotelIdFromRoute: string;

  bookingForm: FormGroup;
  filterForm: FormGroup;
  roomFeatureTypeOption: RoomFeatureTypeOptionModel[];
  flatpickrOptions: FlatpickrOptions;
  account: AuthenticatedLoginDetailsModel;

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
      'numberOfGuests': new FormControl(null,
        [Validators.required,
          Validators.min(1)]),
      'bookingDateRange': new FormControl([],
        [Validators.required,
          Validators.minLength(2)]),
      'roomIdList': new FormArray([],
        this.checkBoxValidator),
    });
    this.filterForm = new FormGroup({
      'roomFeatures': new FormArray([]),
    })
  }

  ngOnInit(): void {
    this.account = this.loginService.authenticatedLoginDetailsModel.getValue();
    if (this.account != null && this.account.role) {
      this.showHotel();
    } else {
      this.loginService.checkSession().subscribe(
        (account) => {
          this.loginService.authenticatedLoginDetailsModel.next(account);
          this.account = this.loginService.authenticatedLoginDetailsModel.getValue();
          if (this.account != null && this.account.role) {
            this.showHotel();
          } else {
            this.loginService.logout();
            this.router.navigate(['/login']);
          }
        });
    }

  }

  showHotel() {

    this.roomService.getRoomFormData().subscribe(
      (roomFormData: RoomFormDataModel) => {
        this.roomFeatureTypeOption = roomFormData.roomFeatures;
        this.createRoomFeaturesCheckboxControl();
      }
    );

    if (this.account.role === "ROLE_HOTELOWNER") {
      this.loginService.authenticatedLoginDetailsModel.subscribe(
        response => {
          this.hotelIdFromLogin = response.hotelId;
          this.getHotelDetail(String(this.hotelIdFromLogin))
        }
      );
    } else {
      this.route.paramMap.subscribe(
        paramMap => {
          const paramMapId = paramMap.get('id');

          if (paramMapId) {
            this.hotelIdFromRoute = paramMapId;

            this.getHotelDetail(this.hotelIdFromRoute);
          }
        });
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

  getFilteredRoomList = () => {
    const data = {
      startDate: this.bookingForm.value.bookingDateRange[0],
      endDate: this.bookingForm.value.bookingDateRange[1],
      roomFeatures: this.createRoomFeaturesFilterArrayToSend(),
    };
    this.roomService.getFilteredRoomList(this.hotel.id, data).subscribe(
      (response: RoomListItemModel[]) => {
        this.hotel.rooms = response;
        this.clearRoomBookingFormArray();
        this.createRoomBookingFormArray();
        this.priceOfBooking = null;
        this.maxNumberOfGuest = 0;
      },
      error => console.warn(error),
    );
  };

  resetFilters() {
    this.filterForm.reset();
    //TODO resetelni a naptárat!!!
    // this.flatpickrInstance.clear();
    this.getFilteredRoomList();
  }

  getPriceOfBookingAndMaxCapacity() {
    let numberOfNights: number = 0;
    let roomsPricePerNight = 0;
    let maxCapacity = 0;
    this.bookingForm.value.roomIdList.forEach((value, index) => {
      if (value) {
        roomsPricePerNight += this.hotel.rooms[index].pricePerNight;
        maxCapacity += this.hotel.rooms[index].numberOfBeds;
      }
    });

    if (this.bookingForm.value.bookingDateRange.length > 1) {
      numberOfNights =
        Math.round((this.bookingForm.value.bookingDateRange[1].getTime() - this.bookingForm.value.bookingDateRange[0].getTime()) / 86400000);
    }
    this.maxNumberOfGuest = maxCapacity;
    console.log('max number of guest: ' + this.maxNumberOfGuest);
    this.priceOfBooking = numberOfNights * roomsPricePerNight;
  }

  createRoomInHotel() {
    this.router.navigate(['/admin/hotel/create-room'])
  }

  updateHotel() {
    this.router.navigate(['/admin/hotel-update'])
  }

  //TODO lechekkolni, hogy van-e a szobához elkövetkező foglalás!!
  deleteRoom(id: number) {
    this.popupService.openConfirmPopup("Biztos törölni szeretnéd a tételt?")
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
    let dialogRef = this.dialog.open(BookingFormDialogComponent, {
      height: '600px',
      width: '800px',
      data: this.createBookingFormDialogData(),
    });
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.router.navigate(['/hotel']);
        }
      }
    )
  }

  createBookingFormDialogData() {
    const input = {...this.bookingForm.value};
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

  private createRoomFeaturesCheckboxControl() {
    this.roomFeatureTypeOption.forEach(() => {
        const control = new FormControl(false);
        (this.filterForm.controls.roomFeatures as FormArray).push(control);
      }
    );
  }

  private createRoomFeaturesFilterArrayToSend(): string[] {
    return this.filterForm.value.roomFeatures
      .map((roomFeatures, index) => roomFeatures ? this.roomFeatureTypeOption[index].name : null)
      .filter(roomFeatures => roomFeatures !== null);
  }

  getPublicId(imgURL: string) {
    return getPublicId(imgURL);
  }

  checkBoxValidator(array: FormArray): { required: boolean } {
    let counter = 0;
    array.getRawValue().forEach(value => value ? counter++ : counter);
    return counter < 1 ? {required: true} : null;
  }

}
