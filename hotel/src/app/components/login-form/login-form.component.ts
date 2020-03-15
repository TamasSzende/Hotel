import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {RegistrationService} from "../../services/registration.service";
import {validationHandler} from "../../utils/validationHandler";

@Component({
  selector: 'app-login.form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private loginService: LoginService, private router: Router, private regService: RegistrationService) {
    this.loginForm = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
  }

  doLogin() {
    const data = {...this.loginForm.value};
    console.log(data);
    this.loginService.authenticate(data).subscribe(
      response => {
        localStorage.setItem('email', JSON.stringify(response));
        this.router.navigateByUrl('/hotel');
        this.loginService.loggedIn.next('');
      },
      error => {
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
