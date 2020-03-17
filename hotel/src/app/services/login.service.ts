import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //TODO visszaállítani 'null'-ra a kezdő értéket!!!!
  // hotelId = new BehaviorSubject<number>(1);
  hotelId = new BehaviorSubject<number>(null);
  loggedIn = new Subject<any>();
  private BASE_URL = environment.BASE_URL;

  constructor(private http: HttpClient) {
  }

  getHotelId(): number {
    return this.hotelId.getValue();
  }

  authenticate(credentials): Observable<any> {
    const headers = new HttpHeaders(credentials ? {
      authorization: 'Basic ' + btoa(credentials.email + ':' + credentials.password),
    } : {});

    return this.http.get(this.BASE_URL + '/api/accounts/me', {headers: headers});
  }

  logout() {
    return this.http.get(this.BASE_URL + '/logout', {withCredentials: true});
  }

}
