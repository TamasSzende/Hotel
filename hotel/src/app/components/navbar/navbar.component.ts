import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn: boolean;
  userRole: string;
  baseRouterLink: string = 'login';

  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.loginService.role.subscribe(
      (response) => {
        if (response !== null) {
          this.loggedIn = true;
          this.userRole = response;
          console.log('userRole: ' + this.userRole);
          if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_USER') {
            this.baseRouterLink = 'hotel';
            console.log("baseRouteLink: " + this.baseRouterLink);
          } else if (this.userRole === 'ROLE_HOTELOWNER') {
            console.log("baseRouteLink: " + this.baseRouterLink);
            this.baseRouterLink = 'admin/hotel';
          } else {
            console.log("baseRouteLink: " + this.baseRouterLink);
            this.baseRouterLink = 'login';
          }
        } else {
          this.loggedIn = false;
        }
      });
  }

  logout() {
    this.loggedIn = false;
    this.userRole = null;
    this.loginService.logout();
    this.router.navigateByUrl('login');

  }

}
