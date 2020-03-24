import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {HotelListItemModel} from "../models/hotelListItem.model";
import {HotelCreateItemModel} from "../models/hotelCreateItem.model";
import {HotelFormDataModel} from "../models/hotelFormData.model";
import {HotelDetailsModel} from "../models/hotelDetails.model";
import {environment} from "../../environments/environment";

const BASE_URL = environment.BASE_URL + '/api/hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor(private http: HttpClient) {
  }

  listHotel(pageNumber: number): Observable<Array<HotelListItemModel>> {
    let params = new HttpParams();
    if (pageNumber) {
      params = params.set('offset', String(pageNumber));
    } else {
      params = params.set('offset', '1');
    }
    return this.http.get<Array<HotelListItemModel>>(BASE_URL, {params});
  }

  deleteHotel(id: number): Observable<Array<HotelListItemModel>> {
    return this.http.delete<Array<HotelListItemModel>>(BASE_URL + '/' + id);
  }

  createHotel(data: HotelCreateItemModel): Observable<number> {
    return this.http.post<number>(BASE_URL, data);
  }

  getHotelFormData(): Observable<HotelFormDataModel> {
    return this.http.get<HotelFormDataModel>(BASE_URL + '/formData');
  }

  updateHotel(data: HotelCreateItemModel, id: number): Observable<any> {
    data.id = id;
    return this.http.put(BASE_URL + '/' + id, data);
  }

  hotelForUpdate(id: string): Observable<HotelCreateItemModel> {
    return this.http.get<HotelCreateItemModel>(BASE_URL + '/formData/' + id);
  }

  hotelDetail(id: string): Observable<HotelDetailsModel> {
    return this.http.get<HotelDetailsModel>(BASE_URL + '/' + id);
  }

  uploadImage(formData: FormData, id: number): Observable<string> {
    return this.http.post<string>(BASE_URL + '/uploadImage/' + id, formData);
  }

  deleteImage(image: string, hotelIdFromLogin: number) {
    const formData = new FormData();
    formData.append('imageURL', image);
    return this.http.post(BASE_URL + "/deleteImage/" + hotelIdFromLogin, formData);
  }

  getHotelImages(hotelId: number): Observable<Array<string>> {
    return this.http.get<Array<string>>(BASE_URL + "/images/" + hotelId);
  }

  getNumOfHotels(): Observable<number> {
    return this.http.get<number>(BASE_URL + '/numOfHotels');
  }
}
