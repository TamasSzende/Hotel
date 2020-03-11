import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HotelService} from "../../services/hotel.service";
import {HotelDetailsModel} from "../../models/hotelDetails.model";
import {RoomService} from "../../services/room.service";
import {LoginService} from "../../services/login.service";
import {RoomListItemModel} from "../../models/roomListItem.model";
import {PopupService} from "../../services/popup.service";

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent implements OnInit {

  hotel: HotelDetailsModel;
  id: number;
  hotelIdString: string;

  constructor(private  hotelService: HotelService, private roomService: RoomService,
              private loginService: LoginService, private route: ActivatedRoute,
              private router: Router, private popupService: PopupService) {
  }

  ngOnInit(): void {

    this.id = this.loginService.getHotelId();
    if (this.id) {
      this.getHotelDetail(String(this.id));
    } else {
      this.route.paramMap.subscribe(
        paramMap => {
          const hotelIdFromRoute = paramMap.get('id');
          if (hotelIdFromRoute) {
            this.hotelIdString = hotelIdFromRoute;
            this.getHotelDetail(this.hotelIdString);
          }
        },
        error => console.warn(error),
      );
    }
  }

  getHotelDetail = (itemId: string) => {
    this.hotelService.hotelDetail(itemId).subscribe(
      (response: HotelDetailsModel) => {
        this.hotel = response;
      }
    );
  };

  createRoomInHotel() {
    this.router.navigate(['/admin/hotel/create-room'])
  }

  updateHotel() {
    this.router.navigate(['/admin/hotel-update'])
  }

  deleteRoom(id: number) {
    this.popupService.openConfirmPopup("Are you sure to delete this record?")
      .afterClosed().subscribe(res => {
      if (res) {
        this.roomService.deleteRoom(id).subscribe(
          (response: RoomListItemModel[]) => {
            this.hotel.rooms = response;
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


}
