import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  hotelId = new BehaviorSubject<number>(null);

  constructor() {
  }

  getHotelId():number {
    return this.hotelId.getValue();
  }

}
