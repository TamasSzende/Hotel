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


  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.loginService.role.subscribe(
      (response) => {
        if (response !== null) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
    });
  }

  logout() {
    this.loggedIn = false;
    this.loginService.logout();
    this.router.navigateByUrl('login');

  }

}
