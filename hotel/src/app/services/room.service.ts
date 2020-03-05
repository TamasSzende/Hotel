import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RoomCreateItemModel} from "../models/roomCreateItem.model";
import {Observable} from "rxjs";
import {RoomListItemModel} from "../models/roomListItem.model";
import {RoomFormDataModel} from "../models/roomFormData.model";
import {RoomDetailsComponent} from "../components/room-details/room-details.component";
import {RoomDetailsModel} from "../models/roomDetails.model";

const BASE_URL = 'http://localhost:8080/api/rooms';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) {
  }

  createRoom(roomCreateItem: RoomCreateItemModel): Observable<any> {
    return this.http.post(BASE_URL, roomCreateItem);
  }

  getRoomList(): Observable<Array<RoomListItemModel>> {
    return this.http.get<Array<RoomListItemModel>>(BASE_URL);
  }

  getRoomFormData(): Observable<RoomFormDataModel> {
    return this.http.get<RoomFormDataModel>(BASE_URL + '/formData');
  }

  roomDetail(id: string): Observable<RoomDetailsModel> {
    return this.http.get<RoomDetailsModel>(BASE_URL + '/' + id);
  }

  deleteRoom(id: number): Observable<Array<RoomListItemModel>> {
    return this.http.delete<Array<RoomListItemModel>>(BASE_URL + '/' + id);
  }

  updateRoom(data: RoomCreateItemModel, id: number): Observable<any> {
    data.id = id;
    return this.http.put(BASE_URL + '/' + id, data);
  }

  getRoomFormForUpdate(id: string): Observable<RoomCreateItemModel> {
    return this.http.get<RoomCreateItemModel>(BASE_URL + '/formData/' + id);
  }




}
