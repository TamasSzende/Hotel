import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RegistrationService} from "../../../services/registration.service";
import {validationHandler} from "../../../utils/validationHandler";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private registrationService: RegistrationService, private router: Router,
              private notificationService: NotificationService) {
    this.registerForm = new FormGroup({
      'email': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'firstname': new FormControl("", Validators.required),
      'lastname': new FormControl("", Validators.required),
      'address': new FormControl("", Validators.required),
    });
  }

  doRegistrationAsUser() {
    this.registrationService.sendUserRegistration(this.registerForm.value).subscribe(
      () => {
        this.notificationService.success('Aktiváló kódot küldtünk a megadott email címedre!');
        this.router.navigate(['/login']);
      },
      errors => {
        validationHandler(errors, this.registerForm);
      }
    );
  }

  ngOnInit() {
  }

  doRegistrationAsHotelOwner() {
    this.registrationService.sendHotelOwnerRegistration(this.registerForm.value).subscribe(
      () => {
        this.notificationService.success('Aktiváló kódot küldtünk a megadott email címedre!');
        this.router.navigate(['/login']);
      },
      errors => {
        validationHandler(errors, this.registerForm);
      }
    );
  }
}
