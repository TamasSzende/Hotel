import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegistrationDetailsModel} from "../models/registrationDetails.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private BASE_URL = environment.BASE_URL + '/api/registrations';

  constructor(private http: HttpClient) {
  }

  sendRegistrationDetails(data: RegistrationDetailsModel) {
    return this.http.post(this.BASE_URL, data);
  }
}
