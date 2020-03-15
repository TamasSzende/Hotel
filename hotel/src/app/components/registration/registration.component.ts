import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RegistrationService} from "../../services/registration.service";
import {validationHandler} from "../../utils/validationHandler";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private registrationService: RegistrationService, private router: Router) {
    this.registerForm = new FormGroup({
      'email': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'firstname': new FormControl("", Validators.required),
      'lastname': new FormControl("", Validators.required),
      'address': new FormControl("", Validators.required),
    });
  }

  doRegistration() {
    this.registrationService.sendRegistrationDetails(this.registerForm.value).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      errors => {
        validationHandler(errors, this.registerForm);
      }
    );
  }

  ngOnInit() {
  }
}
