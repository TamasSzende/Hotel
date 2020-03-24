import {Component, OnInit} from "@angular/core";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'hotel-bookings',
  templateUrl: './hotel-bookings.component.html',
  styleUrls: ['./hotel-bookings.component.css']
})
export class HotelBookingsComponent implements OnInit {

  hotelId: number;

  constructor(private loginService: LoginService, private router: Router) {
  }

  ngOnInit(): void {
    this.loginService.hotelId.subscribe(
      response => {
        if (response) {
          this.hotelId = response;
        } else {
          this.router.navigate(['/login'])
        }
      });
  }


}
