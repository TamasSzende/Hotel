import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BookingCreateItemModel} from "../models/bookingCreateItem.model";
import {BookingDetailsModel} from "../models/bookingDetails.model";
import {environment} from "../../environments/environment";
import {BookingListItemForUserModel} from "../models/bookingListItemForUser.model";
import {BookingListItemForHotelModel} from "../models/bookingListItemForHotel.model";
import {dateToJsonDateString} from '../utils/dateUtils';

const BASE_URL = environment.BASE_URL + '/api/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) {
  }

  createBooking(data: BookingCreateItemModel): Observable<number> {
    const parsedDate = this.parseBookingCreateData(data);
    return this.http.post<number>(BASE_URL, parsedDate);
  }

  bookingDetail(id: number): Observable<BookingDetailsModel> {
    return this.http.get<BookingDetailsModel>(BASE_URL + '/' + id);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(BASE_URL + '/' + id);
  }

  getBookingListByRoom(roomId: number): Observable<Array<BookingListItemForHotelModel>> {
    return this.http.get<Array<BookingListItemForHotelModel>>(BASE_URL + '/room/' + roomId);
  }

  getCurrentBookingListByRoom(roomId: number): Observable<Array<BookingListItemForHotelModel>> {
    return this.http.get<Array<BookingListItemForHotelModel>>(BASE_URL + '/room/current/' + roomId);
  }

  getFutureBookingListByRoom(roomId: number): Observable<Array<BookingListItemForHotelModel>> {
    return this.http.get<Array<BookingListItemForHotelModel>>(BASE_URL + '/room/future/' + roomId);
  }

  getPastBookingListByRoom(roomId: number): Observable<Array<BookingListItemForHotelModel>> {
    return this.http.get<Array<BookingListItemForHotelModel>>(BASE_URL + '/room/past/' + roomId);
  }

  getBookingListByHotel(hotelId: number): Observable<Array<BookingListItemForHotelModel>> {
    return this.http.get<Array<BookingListItemForHotelModel>>(BASE_URL + '/hotel/' + hotelId);
  }

  getCurrentBookingListByHotel(hotelId: number): Observable<Array<BookingListItemForHotelModel>> {
    return this.http.get<Array<BookingListItemForHotelModel>>(BASE_URL + '/hotel/current/' + hotelId);
  }

  getFutureBookingListByHotel(hotelId: number): Observable<Array<BookingListItemForHotelModel>> {
    return this.http.get<Array<BookingListItemForHotelModel>>(BASE_URL + '/hotel/future/' + hotelId);
  }

  getPastBookingListByHotel(hotelId: number): Observable<Array<BookingListItemForHotelModel>> {
    return this.http.get<Array<BookingListItemForHotelModel>>(BASE_URL + '/hotel/past/' + hotelId);
  }

  getBookingListByUser(userId: number): Observable<Array<BookingListItemForUserModel>> {
    return this.http.get<Array<BookingListItemForUserModel>>(BASE_URL + '/user/' + userId);
  }

  getCurrentBookingListByUser(userId: number): Observable<Array<BookingListItemForUserModel>> {
    return this.http.get<Array<BookingListItemForUserModel>>(BASE_URL + '/user/current/' + userId);
  }

  getFutureBookingListByUser(userId: number): Observable<Array<BookingListItemForUserModel>> {
    return this.http.get<Array<BookingListItemForUserModel>>(BASE_URL + '/user/future/' + userId);
  }

  getPastBookingListByUser(userId: number): Observable<Array<BookingListItemForUserModel>> {
    return this.http.get<Array<BookingListItemForUserModel>>(BASE_URL + '/user/past/' + userId);
  }

  parseBookingCreateData(data: BookingCreateItemModel) {
    return {
      guestAccountName: data.guestAccountName,
      remark: data.remark,
      numberOfGuests: data.numberOfGuests,
      startDate: dateToJsonDateString(data.startDate),
      endDate: dateToJsonDateString(data.endDate),
      roomIdList: data.roomIdList,
    }
  }


}
