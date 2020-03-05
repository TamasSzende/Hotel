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

  roomList: RoomListItemModel[] = [];

  constructor(private roomService: RoomService,
              private router: Router) {
  }

  ngOnInit() {
    this.listRoom();
  }

  listRoom = () => {
    this.roomService.getRoomList().subscribe(
      (roomList: RoomListItemModel[]) => {
        this.roomList = roomList;
      }
    );
  };

  deleteRoom(id: number): void {
    this.roomService.deleteRoom(id).subscribe(
      (response: RoomListItemModel[]) => {
        this.roomList = response;
      },
      error => console.warn(error),
    );
  }

  updateRoom(id: number): void {
    this.router.navigate(['/room-form/', id])
  }

  roomDetail(id: number): void {
    this.router.navigate(['/room-detail/', id])
  }

}
