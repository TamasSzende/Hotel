import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {MatDialog} from "@angular/material/dialog";
import {LoginComponent} from "../account/login/login.component";
import {RegistrationComponent} from "../account/registration/registration.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn: boolean;
  userRole: string;
  email: string;
  baseRouterLink: string = 'login';

  constructor(private http: HttpClient, private router: Router, private loginService: LoginService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loginService.authenticatedLoginDetailsModel.subscribe(
      (response) => {
        if (response !== null) {
          this.loggedIn = true;
          this.userRole = response.role;
          this.email = response.name;
          if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_USER') {
            this.baseRouterLink = 'hotel';
          } else if (this.userRole === 'ROLE_HOTELOWNER') {
            this.baseRouterLink = 'admin/hotel';
          } else {
            this.baseRouterLink = 'login';
          }
        } else {
          this.loggedIn = false;
          this.baseRouterLink = 'hotel';
        }
      });
  }

  logout() {
    this.loggedIn = false;
    this.userRole = null;
    this.baseRouterLink = 'login';
    this.router.navigateByUrl('').then(() => this.loginService.logout().subscribe()
    );
  }

  doRegistration(registrationType: string) {
    this.dialog.open(RegistrationComponent, {
      height: '600px',
      width: '400px',
      data: {
        registrationType: registrationType
      }
    });
  }

  doLogin() {
    this.dialog.open(LoginComponent, {
      height: '600px',
      width: '400px',
      data: {
        openedBy: 'navbar'
      }
    });
  }

}
