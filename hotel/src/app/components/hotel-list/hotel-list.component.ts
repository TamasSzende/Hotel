import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HotelService} from "../../services/hotel.service";
import {HotelListItemModel} from "../../models/hotelListItem.model";
import {PopupService} from "../../services/popup.service";
import {getPublicId} from "../../utils/cloudinaryPublicIdHandler";
import {LoginService} from "../../services/login.service";
import {scrollToTheTop} from "../../utils/smoothScroller";
import {AuthenticatedLoginDetailsModel} from "../../models/authenticatedLoginDetails.model";
import {FlatpickrOptions} from "ng2-flatpickr";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {HotelFeatureTypeOptionModel} from "../../models/hotelFeatureTypeOption.model";
import {HotelFormDataModel} from "../../models/hotelFormData.model";

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
  listPageNumber: number = 1;
  pageNumbers: number[];

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
      'hotelFeatures': new FormArray([]),
    })
  }

  ngOnInit(): void {
    this.account = this.loginService.authenticatedLoginDetailsModel.getValue();
    if (this.account != null && this.account.role) {
      this.listHotel();
    } else {
      this.loginService.checkSession().subscribe(
        (account) => {
          this.loginService.authenticatedLoginDetailsModel.next(account);
          this.account = this.loginService.authenticatedLoginDetailsModel.getValue();
          if (this.account != null && this.account.role) {
            this.listHotel();
          } else {
            this.loginService.logout();
            this.router.navigate(['/login']);
          }
        });
    }
  }


  listHotel = () => {

    this.hotelService.getHotelFormData().subscribe(
      (hotelFormData: HotelFormDataModel) => {
        this.hotelFeatureTypeOption = hotelFormData.hotelFeatures;
        this.createHotelFeaturesCheckboxControl();
      }
    );

    this.hotelService.listHotel(this.listPageNumber).subscribe(
      (hotelList: HotelListItemModel[]) => {
        this.hotelList = hotelList;
      }
    );
    this.getPageNumbers();
  };


  filterHotelList() {

  }


  resetFilters() {
    this.filterForm.reset();
    //TODO resetelni a naptárat!!!
    // this.flatpickrInstance.clear();
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


  private createHotelFeaturesCheckboxControl() {
    this.hotelFeatureTypeOption.forEach(() => {
        const control = new FormControl(false);
        (this.filterForm.controls.hotelFeatures as FormArray).push(control);
      }
    );
  }

  onPageNumClick(pageNum: number) {
    this.listPageNumber = pageNum;
    this.listHotel();
    scrollToTheTop(40);
  }


}
