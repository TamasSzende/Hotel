import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {HotelService} from "../../services/hotel.service";
import {HotelFeatureTypeOptionModel} from "../../models/hotelFeatureTypeOption.model";
import {HotelTypeOptionModel} from "../../models/hotelTypeOption.model";
import {HotelFormDataModel} from "../../models/hotelFormData.model";
import {HotelCreateItemModel} from "../../models/hotelCreateItem.model";
import {LoginService} from "../../services/login.service";

// import {validationHandler} from "../../utils/validationHandler";

@Component({
	selector: 'app-hotel-form',
	templateUrl: './hotel-form.component.html',
	styleUrls: ['./hotel-form.component.css']
})
export class HotelFormComponent implements OnInit {

	hotelForm: FormGroup;
	hotelFeatureTypeOption: HotelFeatureTypeOptionModel[];
	hotelTypeOption: HotelTypeOptionModel[];
  private hotelIdFromLogin: number;
	private isUpdate: boolean;

	constructor(private hotelService: HotelService, private loginService: LoginService, private route: ActivatedRoute, private router: Router) {
		this.hotelForm = new FormGroup({
				'name': new FormControl(''),
				'postalCode': new FormControl(''),
				'city': new FormControl(''),
				'streetAddress': new FormControl(''),
				'hotelType': new FormControl(''),
				'hotelImageUrl': new FormControl(''),
				'description': new FormControl(''),
				'hotelFeatures': new FormArray([]),
			}
		);
	}

	ngOnInit() {

    if (!localStorage.getItem('email')) {
      this.router.navigate(['/login'])
    }

    this.hotelService.getHotelFormData().subscribe(
      (hotelFormData: HotelFormDataModel) => {
        this.hotelTypeOption = hotelFormData.hotelType;
        this.hotelFeatureTypeOption = hotelFormData.hotelFeatures;
        this.createHotelFeaturesCheckboxControl();
      }
    );

    this.hotelIdFromLogin = this.loginService.getHotelId();

    if (this.hotelIdFromLogin) {
      this.isUpdate = true;
      this.getHotelCreateData(String(this.hotelIdFromLogin));

    } else {
      this.isUpdate = false;
    }
	}

  onSubmit() {
    const data = {...this.hotelForm.value};
    data.hotelFeatures = this.createHotelFeaturesArrayToSend();
    this.isUpdate ? this.updateHotel(data) : this.createHotel(data);
  }

	createHotel = (data: HotelCreateItemModel) => {
		this.hotelService.createHotel(data).subscribe(
			(hotelId) => {
        console.log('hotelId:' + hotelId);
        this.loginService.hotelId.next(hotelId);
        this.router.navigate(['/admin/hotel']);
			},			error => console.error(error),
		);
	};

	getHotelCreateData = (id: string) => {
		this.hotelService.hotelForUpdate(id).subscribe(
			(response: HotelCreateItemModel) => {
				this.hotelForm.patchValue({
					name: response.name,
					postalCode: response.postalCode,
					city: response.city,
					streetAddress: response.streetAddress,
					hotelType: response.hotelType,
					hotelImageUrl: response.hotelImageUrl,
					description: response.description,
					hotelFeatures: this.createHotelFeaturesFormArray(response.hotelFeatures),
				});
			},
		);
  };

  private updateHotel(data: HotelCreateItemModel) {
    this.hotelService.updateHotel(data, this.hotelIdFromLogin).subscribe(
      () => {
        this.router.navigate(['/admin/hotel']);
      },			error => console.error(error),
    );
  }

  private createHotelFeaturesCheckboxControl() {
    this.hotelFeatureTypeOption.forEach(() => {
        const control = new FormControl(false);
        (this.hotelForm.controls.hotelFeatures as FormArray).push(control);
      }
    );
  }

  private createHotelFeaturesArrayToSend(): string[] {
    return this.hotelForm.value.hotelFeatures
      .map((hotelFeatures, index) => hotelFeatures ? this.hotelFeatureTypeOption[index].name : null)
      .filter(hotelFeatures => hotelFeatures !== null);
  }


  createHotelFeaturesFormArray = (hotelFeaturesNames: string[]) => {
    return this.hotelFeatureTypeOption.map(hotelFeatures => {
        return hotelFeaturesNames.includes(hotelFeatures.name);
      }
    );
  }

}
