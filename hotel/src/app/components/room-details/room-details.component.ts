import {Component, OnInit} from '@angular/core';
import {RoomDetailsModel} from "../../models/roomDetails.model";
import {RoomService} from "../../services/room.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {

  room: RoomDetailsModel;

  constructor(private  roomService: RoomService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      paramMap => {
        const itemId = paramMap.get('id');
        if (itemId) {
          this.getRoomDetail(itemId);
        }
      },
      error => console.warn(error),
    );
  }

  getRoomDetail = (itemId: string) => {
    this.roomService.roomDetail(itemId).subscribe(
      (response: RoomDetailsModel) => {
        this.room = response;
      }
    );
  }

  // backToList() {
  //   this.router.navigate(['/room-list/'])
  // }

}
