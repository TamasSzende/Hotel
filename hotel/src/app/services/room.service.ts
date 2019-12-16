import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RoomFormData} from "../models/roomFormData.model";
import {Observable} from "rxjs";
import {RoomListItemModel} from "../models/roomListItem.model";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  baseUrl = "http://localhost:8080/api/rooms";

  constructor(private httpClient: HttpClient) {
  }

  createRoom(roomFormData: RoomFormData): Observable<any> {
    return this.httpClient.post(this.baseUrl, roomFormData);
  }

  getRoomList(): Observable<Array<RoomListItemModel>> {
    return this.httpClient.get<Array<RoomListItemModel>>(this.baseUrl);
  }

}
