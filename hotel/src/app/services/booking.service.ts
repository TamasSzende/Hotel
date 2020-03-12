import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BookingCreateItemModel} from "../models/bookingCreateItem.model";

const BASE_URL = 'http://localhost:8080/api/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) {
  }

  createBooking(data: BookingCreateItemModel): Observable<any> {
    return this.http.post(BASE_URL, data);
  }


}
