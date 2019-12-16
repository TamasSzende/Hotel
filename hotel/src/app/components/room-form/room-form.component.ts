import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {RoomService} from "../../services/room.service";
import {Router} from "@angular/router";
import {validationHandler} from "../../utils/validationHandler";

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css']
})
export class RoomFormComponent implements OnInit {

  roomForm = this.formBuilder.group({
    "name": ['',],
    "numberOfBeds": [0],
    "pricePerNight": [0],
    "description": [''],
    "imageUrl": ['']
  });

  constructor(private formBuilder: FormBuilder,
              private roomService: RoomService,
              private router: Router) {
  }

  ngOnInit() {
  }

  submit = () => {
    this.roomService.createRoom(this.roomForm.value).subscribe(
      () => this.router.navigate(["room-list"]),
      error => validationHandler(error, this.roomForm),
    );

  };
}
