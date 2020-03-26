import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AccountDetailsForMyProfileModel} from "../models/AccountDetailsForMyProfile.model";
import {AuthenticatedLoginDetailsModel} from "../models/authenticatedLoginDetails.model";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private BASE_URL = environment.BASE_URL;

  authenticatedLoginDetailsModel = new BehaviorSubject<AuthenticatedLoginDetailsModel>(null);


  constructor(private http: HttpClient) {
  }

  getUserId(): number {
    const account: AuthenticatedLoginDetailsModel = this.authenticatedLoginDetailsModel.getValue();
    if (account) {
      return this.authenticatedLoginDetailsModel.getValue().id;
    } else {
      return null
    }
  }

  getHotelId(): number {
    const account: AuthenticatedLoginDetailsModel = this.authenticatedLoginDetailsModel.getValue();
    if (account) {
      return this.authenticatedLoginDetailsModel.getValue().hotelId;
    } else {
      return null
    }
  }

  getUsername(): string {
    const account: AuthenticatedLoginDetailsModel = this.authenticatedLoginDetailsModel.getValue();
    if (account) {
      return this.authenticatedLoginDetailsModel.getValue().name;
    } else {
      return null
    }
  }

  getRole(): string {
    const account: AuthenticatedLoginDetailsModel = this.authenticatedLoginDetailsModel.getValue();
    if (account) {
      return this.authenticatedLoginDetailsModel.getValue().role;
    } else {
      return null
    }
  }

  authenticate(credentials): Observable<AuthenticatedLoginDetailsModel> {
    const headers = new HttpHeaders(credentials ? {
      authorization: 'Basic ' + btoa(credentials.email + ':' + credentials.password),
    } : {});
    return this.http.get<AuthenticatedLoginDetailsModel>(this.BASE_URL + '/api/accounts/me', {headers: headers});
  }

  logout() {
    this.authenticatedLoginDetailsModel.next(null);
    return this.http.post(this.BASE_URL + '/api/accounts/logout', {})
  }

  activateUser(token: string) {
    return this.http.put<any>(this.BASE_URL + '/api/registrations', token);
  }

  //-------Profilomhoz-------

  getAccountDetails = (email: string): Observable<AccountDetailsForMyProfileModel> => {
    return this.http.get<AccountDetailsForMyProfileModel>(this.BASE_URL + '/api/accounts/' + email);
  };

  checkSession() {
    return this.http.get<AuthenticatedLoginDetailsModel | null>(this.BASE_URL + '/api/accounts/sessionCheck');
  }
}
