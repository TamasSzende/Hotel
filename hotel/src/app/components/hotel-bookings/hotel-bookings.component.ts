import {Component, OnInit} from "@angular/core";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";
import {serialize} from "@angular/compiler/src/i18n/serializers/xml_helper";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'hotel-bookings',
  templateUrl: './hotel-bookings.component.html',
  styleUrls: ['./hotel-bookings.component.css']
})
export class HotelBookingsComponent implements OnInit {
  hotelId = new BehaviorSubject<number>(0);

  constructor(private loginService: LoginService, private router: Router) {

  }

  ngOnInit(): void {
    this.loginService.authenticatedLoginDetailsModel.subscribe(
      response => {
        if (response) {
          this.hotelId.next(response.hotelId);
        } else {
          this.loginService.checkSession().subscribe((account) => {
            this.loginService.authenticatedLoginDetailsModel.next(account);
            if (account) {
              this.hotelId.next(account.hotelId);
            } else {
              this.router.navigate([''])
            }
          });
        }
      });
  }


}
