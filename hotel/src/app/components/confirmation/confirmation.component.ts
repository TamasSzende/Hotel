import {Component, OnInit} from "@angular/core";
import {LoginService} from "../../services/login.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  token: string;
  isActivated: boolean = false;

  constructor(private loginService: LoginService, private route: ActivatedRoute) {

  }

  // ngOnInit(): void {
  //   this.route.queryParams.subscribe(
  //     params => {
  //       console.log(params);
  //       console.log(params.token);
  //
  //     },
  //     error => console.warn(error),
  //   );
  //  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(
      paramMap => {
        const tokenFromRoute = paramMap.get('token');
        console.log(tokenFromRoute);
        if (tokenFromRoute) {
          this.token = tokenFromRoute;
          this.activateUser();
        }
      },
      error => console.warn(error),
    );
  }

  private activateUser() {
    this.loginService.activateUser(this.token).subscribe(
      () => {
        this.isActivated = true;
      },
      error => console.warn(error),
    );
  }
}
