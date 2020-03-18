import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BookingCreateItemModel} from "../models/bookingCreateItem.model";
import {BookingDetailsModel} from "../models/bookingDetails.model";
import {environment} from "../../environments/environment";

const BASE_URL = environment.BASE_URL+'/api/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) {
  }

  createBooking(data: BookingCreateItemModel): Observable<number> {
    return this.http.post<number>(BASE_URL, data);
  }

  bookingDetail(id: number): Observable<BookingDetailsModel> {
    return this.http.get<BookingDetailsModel>(BASE_URL + '/' + id);
  }


}
