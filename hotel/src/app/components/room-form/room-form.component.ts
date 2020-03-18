import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {RoomService} from "../../services/room.service";
import {ActivatedRoute, Router} from "@angular/router";
import {validationHandler} from "../../utils/validationHandler";
import {RoomFeatureTypeOptionModel} from "../../models/roomFeatureTypeOption.model";
import {RoomTypeOptionModel} from "../../models/roomTypeOption.model";
import {RoomFormDataModel} from "../../models/roomFormData.model";
import {RoomCreateItemModel} from "../../models/roomCreateItem.model";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css']
})
export class RoomFormComponent implements OnInit {

  roomForm: FormGroup;
  roomFeatureTypeOption: RoomFeatureTypeOptionModel[];
  roomTypeOption: RoomTypeOptionModel[];
  private hotelId: number;
  private roomId: number;

  constructor(private route: ActivatedRoute,
              private roomService: RoomService,
              private loginService: LoginService,
              private router: Router) {
    this.roomForm = new FormGroup({
        'roomName': new FormControl(''),
        'roomType': new FormControl(''),
        'numberOfBeds': new FormControl(null),
        'roomArea': new FormControl(null),
        'pricePerNight': new FormControl(null),
        'roomImageUrl': new FormControl(''),
        'description': new FormControl(''),
        'roomFeatures': new FormArray([]),
      }
    );
  }

  ngOnInit() {
    this.loginService.hotelId.subscribe(
      response =>
        this.hotelId = response
    );

    this.roomService.getRoomFormData().subscribe(
      (roomFormData: RoomFormDataModel) => {
        this.roomTypeOption = roomFormData.roomType;
        this.roomFeatureTypeOption = roomFormData.roomFeatures;
        this.createRoomFeaturesCheckboxControl();

        this.route.paramMap.subscribe(
          paramMap => {
            const updateRoomId = paramMap.get('id');
            if (updateRoomId) {
              this.roomId = +updateRoomId;
              this.getRoomCreateData(updateRoomId);
            }
          },
          error => console.warn(error),
        );
      }
    );
  }

  onSubmit() {
    const data = {...this.roomForm.value};
    data.roomFeatures = this.createRoomFeaturesArrayToSend();
    data.hotelId = this.hotelId;
    this.roomId ? this.updateRoom(data) : this.createRoom(data);
  }

  private createRoom(data: RoomCreateItemModel) {
    this.roomService.createRoom(data).subscribe(
      () => {
        this.router.navigate(['admin/hotel']);
      }, error => validationHandler(error, this.roomForm),
    );
  }


  getRoomCreateData = (id: string) => {
    this.roomService.getRoomFormForUpdate(id).subscribe(
      (response: RoomCreateItemModel) => {
        if (this.hotelId === response.hotelId) {
          this.roomForm.patchValue({
            roomName: response.roomName,
            roomType: response.roomType,
            numberOfBeds: response.numberOfBeds,
            roomArea: response.roomArea,
            hotelId: response.hotelId,
            pricePerNight: response.pricePerNight,
            roomImageUrl: response.roomImageUrl,
            description: response.description,
            roomFeatures: this.createRoomFeaturesFormArray(response.roomFeatures),
          });
        }
      },
    );
  };

  private updateRoom(data: RoomCreateItemModel) {
    this.roomService.updateRoom(data, this.roomId).subscribe(
      () => {
        this.router.navigate(['/admin/hotel']);
      }, error => validationHandler(error, this.roomForm),
    );
  }

  private createRoomFeaturesCheckboxControl() {
    this.roomFeatureTypeOption.forEach(() => {
        const control = new FormControl(false);
        (this.roomForm.controls.roomFeatures as FormArray).push(control);
      }
    );
  }

  private createRoomFeaturesArrayToSend(): string[] {
    return this.roomForm.value.roomFeatures
      .map((roomFeatures, index) => roomFeatures ? this.roomFeatureTypeOption[index].name : null)
      .filter(roomFeatures => roomFeatures !== null);
  }

  createRoomFeaturesFormArray = (roomFeaturesNames: string[]) => {
    return this.roomFeatureTypeOption.map(roomFeatures => {
        return roomFeaturesNames.includes(roomFeatures.name);
      }
    );
  }

}
