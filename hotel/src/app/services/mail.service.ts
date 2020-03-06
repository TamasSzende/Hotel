import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MailModel} from "../models/mail.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private BASE_URL = 'http://localhost:8080/api/registrations';

  constructor(private http: HttpClient) {
  }

  registerMail(userData: MailModel): Observable<any> {
    return this.http.post(this.BASE_URL, userData)
  }
}
