import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {RegistrationService} from "../../services/registration.service";
import {validationHandler} from "../../utils/validationHandler";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private loginService: LoginService, private router: Router,
              private regService: RegistrationService, private notificationService: NotificationService) {
    this.loginForm = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
  }

  doLogin() {
    const data = {...this.loginForm.value};
    this.loginService.authenticate(data).subscribe(
      response => {
        this.loginService.username.next(response.name);
        this.loginService.role.next(response.role);
        if (response.hotelId) {
          this.loginService.hotelId.next(response.hotelId);
        }
        this.notificationService.success('Logged in successfully!');
        this.router.navigateByUrl('/hotel');
      },
      error => {
        this.notificationService.unsuccessful('Wrong username or password given!');
        this.loginForm.reset();
        error.error = {
          fieldErrors: [
            {
              field: 'userEmail',
              message: 'Invalid email or password',
            },
          ],
        };

        validationHandler(error, this.loginForm);
      });

    return false;
  }

  doRegistration() {
    this.router.navigate(['/registrations']);
  }

}
