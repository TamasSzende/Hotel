import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HotelService} from "../../services/hotel.service";
import {HotelListItemModel} from "../../models/hotelListItem.model";
import {PopupService} from "../../services/popup.service";
import {getPublicId} from "../../utils/cloudinaryPublicIdHandler";
import {LoginService} from "../../services/login.service";
import {AuthenticatedLoginDetailsModel} from "../../models/authenticatedLoginDetails.model";
import {FlatpickrOptions} from "ng2-flatpickr";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {HotelFeatureTypeOptionModel} from "../../models/hotelFeatureTypeOption.model";
import {HotelFormDataModel} from "../../models/hotelFormData.model";
import {dateToJsonDateString} from "../../utils/dateUtils";
import {HotelListItemSubListModel} from "../../models/hotelListItemSubList.model";
import {scrollToTheTop} from "../../utils/smoothScroller";

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {

  hotelList: HotelListItemModel[] = [];
  account: AuthenticatedLoginDetailsModel;
  filterForm: FormGroup;
  hotelFeatureTypeOption: HotelFeatureTypeOptionModel[];
  flatpickrOptions: FlatpickrOptions;
  listPageNumber: number = 0;
  pageNumbers: number[];
  mapCenter = {
    latitude: 47.497913,
    longitude: 19.040236,
  }

  constructor(private hotelService: HotelService, private route: ActivatedRoute, private router: Router, private popupService: PopupService, private loginService: LoginService) {
    this.flatpickrOptions = {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
    };
    this.filterForm = new FormGroup({
      'numberOfGuests': new FormControl(null,
        [Validators.required,
          Validators.min(1)]),
      'bookingDateRange': new FormControl([],
        [Validators.required,
          Validators.minLength(2)]),
      'hotelFeatures': new FormArray([]),
    })
  }

  ngOnInit(): void {

    this.account = this.loginService.authenticatedLoginDetailsModel.getValue();
    if (!this.account) {
      this.loginService.checkSession().subscribe(
        (response) => {
          if (response) {
            this.loginService.authenticatedLoginDetailsModel.next(response);
          }
          this.account = response;
          if (!this.account || this.account.role != "ROLE_HOTELOWNER") {
            this.listHotel();
          } else {
            this.router.navigate(['admin/hotel'])
          }
        }
      )
    } else {
      if (this.account.role != "ROLE_HOTELOWNER") {
        this.listHotel();
      } else {
        this.router.navigate(['admin/hotel'])
      }
    }
  }

  listHotel = () => {
    this.hotelService.getHotelFormData().subscribe(
      (hotelFormData: HotelFormDataModel) => {
        this.hotelFeatureTypeOption = hotelFormData.hotelFeatures;
        this.createHotelFeaturesCheckboxControl();
      }
    );

    if (this.router.url.startsWith('/hotel/filter?')) {
      this.route.queryParams.subscribe(
        queryParams => {
          let filterData = {
            numberOfGuests: queryParams['numberOfGuests'],
            startDate: queryParams['startDate'],
            endDate: queryParams['endDate'],
            hotelFeatures: queryParams['hotelFeatures'],
          };
          if (filterData.hotelFeatures == undefined) {
            filterData.hotelFeatures = '';
          }
          this.listPageNumber = queryParams['listPageNumber'];

          this.filterForm.controls['numberOfGuests'].setValue(filterData.numberOfGuests);


          this.hotelService.getFilteredHotelList(filterData, this.listPageNumber).subscribe(
            (response: HotelListItemSubListModel) => {
              this.hotelList = response.hotelSubList;
              this.listPageNumber = response.listPageNumber;
              this.pageNumbers = this.generatePageNumberArray(response.fullNumberOfPages);
            }
          );
        }
      );
    } else {
      this.route.queryParams.subscribe(
        queryParams => {
          this.listPageNumber = queryParams['listPageNumber'];
          this.hotelService.listHotel(this.listPageNumber).subscribe(
            (response: HotelListItemSubListModel) => {
              this.hotelList = response.hotelSubList;
              this.listPageNumber = response.listPageNumber;
              this.pageNumbers = this.generatePageNumberArray(response.fullNumberOfPages);
            }
          );
        }
      );
    }
  };

  onPageNumClick(pageNum: number) {
    if (this.router.url.startsWith('/hotel/filter?')) {
      this.route.queryParams.subscribe(
        queryParamsFromRoute => {
          const queryParams = {
            numberOfGuests: queryParamsFromRoute['numberOfGuests'],
            startDate: queryParamsFromRoute['startDate'],
            endDate: queryParamsFromRoute['endDate'],
            hotelFeatures: queryParamsFromRoute['hotelFeatures'],
            'listPageNumber': pageNum
          };
          this.router.navigate(['/hotel/filter'], {queryParams});
        }
      );
    } else {
      const queryParams = {'listPageNumber': pageNum};
      this.router.navigate(['hotel'], {queryParams});
    }
  }

  generatePageNumberArray(numOfHotels: number) {
    let numArray = new Array<number>();
    for (let i = 0; i < numOfHotels; i++) {
      numArray.push(i);
    }
    return numArray;
  }

  filterHotelList() {
    const queryParams = {
      'numberOfGuests': this.filterForm.value.numberOfGuests,
      'startDate': dateToJsonDateString(this.filterForm.value.bookingDateRange[0]),
      'endDate': dateToJsonDateString(this.filterForm.value.bookingDateRange[1]),
      'hotelFeatures': this.createHotelFeaturesFilterArrayToSend().join(', '),
    };
    this.router.navigate(['/hotel/filter'], {queryParams})
  }

  resetFilters() {
    this.filterForm.reset();
    //TODO resetelni a naptárat!!!
    // this.flatpickrInstance.clear();
  }

  backToHotelList() {
    this.router.navigate(['/hotel'])
  }

  deleteHotel(id: number): void {
    this.popupService.openConfirmPopup("Biztos törölni szeretnéd a tételt?")
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

  private createHotelFeaturesCheckboxControl() {
    this.hotelFeatureTypeOption.forEach(() => {
        const control = new FormControl(false);
        (this.filterForm.controls.hotelFeatures as FormArray).push(control);
      }
    );
  }

  private createHotelFeaturesFilterArrayToSend(): string[] {
    return this.filterForm.value.hotelFeatures
      .map((hotelFeatures, index) => hotelFeatures ? this.hotelFeatureTypeOption[index].name : null)
      .filter(hotelFeatures => hotelFeatures !== null);
  }

  gotoTop() {
    scrollToTheTop(100);
  }

}
