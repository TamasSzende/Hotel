import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {RoomCreateItemModel} from "../models/roomCreateItem.model";
import {Observable} from "rxjs";
import {RoomListItemModel} from "../models/roomListItem.model";
import {RoomFormDataModel} from "../models/roomFormData.model";
import {RoomDetailsModel} from "../models/roomDetails.model";
import {environment} from "../../environments/environment";

const BASE_URL = environment.BASE_URL + '/api/rooms';

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

  getFilteredRoomList(hotelId: number, data: { startDate: Date; endDate: Date; roomFeatures: string[] }): Observable<Array<RoomListItemModel>> {
    const params = new HttpParams()
      .set('startDate', this.dateToJsonDateString(data.startDate))
      .set('endDate', this.dateToJsonDateString(data.endDate))
      .set('roomFeatures', data.roomFeatures.join(', '));
    return this.http.get<Array<RoomListItemModel>>(BASE_URL + '/filter/' + hotelId, {params});
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

  dateToJsonDateString(date: Date) {
    let result: string = date.getFullYear() + '. ';
    let month = date.getMonth() + 1;
    if (month.toString().length === 1) {
      result += '0';
    }
    result += month + '. ';
    if (date.getDate().toString().length === 1) {
      result += '0';
    }
    result += date.getDate() + '.';
    return result;
  }
}
