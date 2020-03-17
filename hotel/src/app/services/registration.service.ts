import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegistrationDetailsModel} from "../models/registrationDetails.model";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private BASE_URL = 'http://localhost:8080/api/registrations';

  constructor(private http: HttpClient) {
  }

  sendRegistrationDetails(data: RegistrationDetailsModel) {
    return this.http.post(this.BASE_URL, data);
  }
}
