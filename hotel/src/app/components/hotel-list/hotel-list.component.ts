import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HotelService} from "../../services/hotel.service";
import {HotelListItemModel} from "../../models/hotelListItem.model";
import {PopupService} from "../../services/popup.service";
import {getPublicId} from "../../utils/cloudinaryPublicIdHandler";

import {LoginService} from "../../services/login.service";
import {Cloudinary} from "cloudinary-core";

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {


  hotelList: HotelListItemModel[] = [];
  userRole: string;

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
    this.hotelService.listHotel().subscribe(
      (hotelList: HotelListItemModel[]) => {
        this.hotelList = hotelList;
      }
    );
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

  updateHotel(id: number): void {
    this.router.navigate(['/admin/hotel-update'])
  }

  hotelDetail(id: number): void {
    this.router.navigate(['/hotel/', id])
  }

  getPublicId(imgURL: string) {
    return getPublicId(imgURL);
  }

}
