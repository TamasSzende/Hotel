import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FlatpickrOptions} from "ng2-flatpickr";
import {HotelService} from "../../services/hotel.service";
import {Router} from "@angular/router";
import {PopupService} from "../../services/popup.service";
import {LoginService} from "../../services/login.service";
import {dateToJsonDateString} from "../../utils/dateUtils";
import {HotelItemForHomePageModel} from "../../models/hotelItemForHomePage.model";
import {getPublicId} from "../../utils/cloudinaryPublicIdHandler";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  bestPriceHotelList: HotelItemForHomePageModel[];
  bestAvgRateHotelList: HotelItemForHomePageModel[];
  randomHotelList: HotelItemForHomePageModel[];

  filterForm: FormGroup;
  flatpickrOptions: FlatpickrOptions;

  constructor(private hotelService: HotelService, private router: Router, private popupService: PopupService, private loginService: LoginService) {
    this.flatpickrOptions = {
      mode: "range",
      minDate: "today",
      dateFormat: "Y-m-d",
    };
    this.filterForm = new FormGroup({
      'numberOfGuests': new FormControl(null,
        [Validators.required,
          Validators.min(1)]),
      'bookingDateRange': new FormControl([],
        [Validators.required,
          Validators.minLength(2)]),
    })
  }

  ngOnInit(): void {
    document.body.classList.add('bg-img');
    this.hotelService.getTheBestHotelListPriceForHomePage().subscribe(
      (response: HotelItemForHomePageModel[]) =>
        this.bestPriceHotelList = response
    );
    this.hotelService.getTheBestAvgRateHotelListForHomePage().subscribe(
      (response: HotelItemForHomePageModel[]) =>
        this.bestAvgRateHotelList = response
    );
    this.hotelService.getRandomHotelListForHomePage().subscribe(
      (response: HotelItemForHomePageModel[]) =>
        this.randomHotelList = response
    );
  }

  filterHotelList() {
    const queryParams = {
      'numberOfGuests': this.filterForm.value.numberOfGuests,
      'startDate': dateToJsonDateString(this.filterForm.value.bookingDateRange[0]),
      'endDate': dateToJsonDateString(this.filterForm.value.bookingDateRange[1]),
    };
    this.router.navigate(['/hotel/filter'], {queryParams})
  }

  goToHotelList() {
    this.router.navigate(['/hotel'])
  }

  goToHotelDetails(id: number): void {
    this.router.navigate(['/hotel/', id])
  }

  getPublicId(imgURL: string) {
    return getPublicId(imgURL);
  }

}
