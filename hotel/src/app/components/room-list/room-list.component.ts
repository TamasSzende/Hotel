import {Component, OnInit} from '@angular/core';
import {RoomService} from "../../services/room.service";
import {RoomListItemModel} from "../../models/roomListItem.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  roomListItems: Array<RoomListItemModel>;

  constructor(private roomService: RoomService,
              private router: Router) {
  }

  ngOnInit() {
    this.roomService.getRoomList().subscribe(
      roomListItems => this.roomListItems = roomListItems
    );
  }

  details(id: number) {
    this.router.navigate(['/room-details/', id]);
  }
}
