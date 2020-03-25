import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginService} from "../../../services/login.service";
import {RegistrationService} from "../../../services/registration.service";
import {validationHandler} from "../../../utils/validationHandler";
import {NotificationService} from "../../../services/notification.service";

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
        this.loginService.userId.next(response.id);
        this.loginService.username.next(response.name);
        this.loginService.role.next(response.role);
        if (response.hotelId) {
          this.loginService.hotelId.next(response.hotelId);
        }
        this.notificationService.success('Sikeresen beléptél!');
        this.navigateAfterLogin(response);
      },
      error => {
        this.notificationService.unsuccessful('Rossz a megadott email címed vagy jelszavad!');
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

  navigateAfterLogin(response) {
    if (response.role === "ROLE_ADMIN" || response.role === "ROLE_USER") {
      this.router.navigateByUrl('/hotel');
    } else if (response.role === "ROLE_HOTELOWNER" && !response.hotelId) {
      this.router.navigateByUrl('/admin/hotel-create');
    } else if (response.role === "ROLE_HOTELOWNER" && response.hotelId) {
      this.router.navigateByUrl('admin/hotel');
    } else {
      this.router.navigateByUrl('/login')
    }
  }

}
