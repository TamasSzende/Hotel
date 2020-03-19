import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private BASE_URL = 'http://localhost:8080';

  hotelId = new BehaviorSubject<number>(null);
  username = new BehaviorSubject<string>(null);
  role = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient) {
  }

  getHotelId(): number {
    return this.hotelId.getValue();
  }

  getUsername(): string {
    return this.username.getValue();
  }

  getRole(): string {
    return this.role.getValue();
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
