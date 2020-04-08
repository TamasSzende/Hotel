import {Component, Input, OnInit} from '@angular/core';
import {BookingListItemForHotelModel} from "../../../models/bookingListItemForHotel.model";
import {BookingService} from "../../../services/booking.service";
import {PopupService} from "../../../services/popup.service";
import {MatDialog} from "@angular/material/dialog";
import {BookingDetailDialogComponent} from "../../booking-detail-dialog/booking-detail-dialog.component";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'actual-hotel-bookings',
  templateUrl: './actual-hotel-bookings.component.html',
  styleUrls: ['./actual-hotel-bookings.component.css']
})
export class ActualHotelBookingsComponent implements OnInit {

  @Input() hotelId: BehaviorSubject<number>;
  currentBookingList: BookingListItemForHotelModel[];
  private id: number;
  fullNumberOfPages: number;
  private listPageNumber: number = 0;
  private pageNumbers: number[];

  constructor(private bookingService: BookingService,
              private popupService: PopupService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.hotelId.subscribe((id) => {
      if (id != 0) {
        this.id = id;
        this.getCurrentBookingList(id);
      }
    });
  }

  getCurrentBookingList(hotelId: number) {
    this.bookingService.getCurrentBookingListByHotel(hotelId, this.listPageNumber).subscribe(
      (response) => {
        this.currentBookingList = response.bookingSubList;
        this.fullNumberOfPages = response.fullNumberOfPages;
        this.pageNumbers = this.generatePageNumberArray(this.fullNumberOfPages);
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

  onPageNumClick(number: number) {
    this.listPageNumber = number;
    this.getCurrentBookingList(this.id);
  }


  generatePageNumberArray(numOfHotels: number) {
    let numArray = new Array<number>();
    for (let i = 0; i < numOfHotels; i++) {
      numArray.push(i);
    }
    return numArray;
  }

}
