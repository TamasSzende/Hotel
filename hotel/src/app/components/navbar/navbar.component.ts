import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
// import {LoginModel} from "../../models/login.model";
import {LoginService} from "../../services/login.service";
import {environment} from "../../../environments/environment";

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
    this.loginService.loggedIn.subscribe(() => {
      this.loggedIn = true;
    });
  }

  logout() {
    this.http.post(environment.BASE_URL + '/logout', {})
      .subscribe(() => {
        localStorage.removeItem('email');
        this.router.navigateByUrl('login');
        this.ngOnInit();
        this.loggedIn = false;
      });
  }

  // checkRole(role: string):boolean{
  //   return role==='ROLE_ADMIN';
  // }
}
