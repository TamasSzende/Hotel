import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HotelService} from "../../services/hotel.service";
import {HotelListItemModel} from "../../models/hotelListItem.model";
import {PopupService} from "../../services/popup.service";
import {getPublicId} from "../../utils/cloudinaryPublicIdHandler";

import {LoginService} from "../../services/login.service";
import {Cloudinary} from "cloudinary-core";
import {scrollToTheTop} from "../../utils/smoothScroller";

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {


  hotelList: HotelListItemModel[] = [];
  userRole: string;
  listPageNumber: number = 1;
  pageNumbers: number[];

  constructor(private hotelService: HotelService, private router: Router, private popupService: PopupService, private loginService: LoginService) {
  }

  ngOnInit(): void {

    this.userRole = this.loginService.getRole();
    if (this.userRole) {
      this.listHotel();
    } else {
      this.router.navigate(['/login'])
    }
  }


  listHotel = () => {
    this.hotelService.listHotel(this.listPageNumber).subscribe(
      (hotelList: HotelListItemModel[]) => {
        this.hotelList = hotelList;
      }
    );
    this.getPageNumbers();
  };

  deleteHotel(id: number): void {
    this.popupService.openConfirmPopup("Are you sure to delete this record?")
      .afterClosed().subscribe(res => {
      if (res) {
        this.hotelService.deleteHotel(id).subscribe(
          (response: HotelListItemModel[]) => {
            this.hotelList = response;
          },
          error => console.warn(error),
        );
      }
    })
  }

  getPageNumbers() {
    this.hotelService.getNumOfHotels().subscribe(
      (numOfHotels) => {
        this.pageNumbers = this.generatePageNumberArray(numOfHotels);
      }
    );
  }

  updateHotel(id: number): void {
    this.router.navigate(['/admin/hotel-update'])
  }

  hotelDetail(id: number): void {
    this.router.navigate(['/hotel/', id])
  }

  getPublicId(imgURL: string) {
    return getPublicId(imgURL);
  }


  generatePageNumberArray(numOfHotels: number) {
    let numArray = new Array<number>();
    for (let i = 1; i <= numOfHotels; i++) {
      numArray.push(i);
    }
    return numArray;
  }

  onPageNumClick(pageNum: number) {
    this.listPageNumber = pageNum;
    this.listHotel();
    scrollToTheTop(40);
  }

}
