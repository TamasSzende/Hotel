import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
// import {LoginModel} from "../../models/login.model";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedIn: boolean = false;
  // role: boolean;
  // user: LoginModel;

  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.loginService.username.subscribe(() => {
      this.loggedIn = true;
    });
  }

  logout() {

    this.loginService.logout();
    this.router.navigateByUrl('login');

  }

  // checkRole(role: string):boolean{
  //   return role==='ROLE_ADMIN';
  // }
}
