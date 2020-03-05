import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HotelService} from "../../services/hotel.service";
import {HotelDetailsModel} from "../../models/hotelDetails.model";

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent implements OnInit {

	hotel: HotelDetailsModel;

	constructor(private  hotelService: HotelService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      paramMap => {
        const itemId = paramMap.get('id');
        if (itemId) {
          this.getHotelDetail(itemId);
        }
      },
      error => console.warn(error),
    );
  }

  getHotelDetail = (itemId: string) => {
    this.hotelService.hotelDetail(itemId).subscribe(
      (response: HotelDetailsModel) => {
        this.hotel = response;
      }
    );
  }

  backToList() {
    this.router.navigate(['/hotel-list/'])
  }
}
