import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //TODO visszaállítani 'null'-ra a kezdő értéket!!!!
  // hotelId = new BehaviorSubject<number>(1);
  hotelId = new Subject<number>();
  username = new Subject<string>();
  role = new Subject<string>();


  private BASE_URL = 'http://localhost:8080';


  constructor(private http: HttpClient) {
  }

  authenticate(credentials): Observable<any> {
    const headers = new HttpHeaders(credentials ? {
      authorization: 'Basic ' + btoa(credentials.email + ':' + credentials.password),
    } : {});
    return this.http.get(this.BASE_URL + '/api/accounts/me', {headers: headers});
  }

  logout() {
    this.hotelId.next(null);
    this.username.next(null);
    this.role.next(null);

    //TODO valahova backendre küldeni egy POST-ot
    return this.http.get(this.BASE_URL + '/api/logout', {withCredentials: true});
  }

  activateUser(token: string) {
    return this.http.put<any>(this.BASE_URL + '/api/registrations', token);
  }
}
