import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //TODO visszaállítani 'null'-ra a kezdő értéket!!!!
  hotelId = new BehaviorSubject<number>(1);

  constructor() {
  }

  getHotelId():number {
    return this.hotelId.getValue();
  }

}
