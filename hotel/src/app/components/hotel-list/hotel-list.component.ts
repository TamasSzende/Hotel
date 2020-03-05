import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HotelService} from "../../services/hotel.service";
import {HotelListItemModel} from "../../models/hotelListItem.model";

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {

	hotelList: HotelListItemModel[] = [];

	constructor(private hotelService: HotelService, private router: Router) { }

	ngOnInit(): void {
		this.listHotel();
	}

	listHotel = () => {
		this.hotelService.listHotel().subscribe(
			(hotelList: HotelListItemModel[]) => {
				this.hotelList = hotelList;
			}
		);
	};

	deleteHotel(id: number): void {
		this.hotelService.deleteHotel(id).subscribe(
			(response: HotelListItemModel[]) => {
				this.hotelList = response;
			},
			error => console.warn(error),
		);
	}

	updateHotel(id: number): void {
		this.router.navigate(['/hotel-form/', id])
	}

	hotelDetail(id: number): void {
		this.router.navigate(['/hotel-detail/', id])
	}

	goToRoomDetail(id: number) {
		this.router.navigate(['/room-detail/', id])
	}

}
