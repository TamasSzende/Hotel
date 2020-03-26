import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {validationHandler} from "../../../utils/validationHandler";
import {RegistrationService} from "../../../services/registration.service";
import {AccountDetailsForMyProfileModel} from "../../../models/accountDetailsForMyProfile.model";
import {LoginService} from "../../../services/login.service";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {
  registerForm: FormGroup;
  account: AccountDetailsForMyProfileModel;
  user;

  constructor(private loginService: LoginService, private registrationService: RegistrationService, private router: Router,
              private notificationService: NotificationService) {
    this.registerForm = new FormGroup({
      'firstname': new FormControl("", Validators.required),
      'lastname': new FormControl("", Validators.required),
      'address': new FormControl("", Validators.required),
    });
  }

  ngOnInit() {
    this.user = this.loginService.getUsername();
    this.loginService.getAccountDetails(this.user).subscribe(
      (userAccount: AccountDetailsForMyProfileModel) => {
        this.account = userAccount;
        this.registerForm.patchValue({
          firstname: userAccount.firstname,
          lastname: userAccount.lastname,
          address: userAccount.address
        })
      }
    )
  }

  doSaveModifiedAccount() {
    this.registrationService.updateUserAccount(this.registerForm.value, this.user).subscribe(
      () => {
        this.notificationService.success('A változtatásaid elmentettük!');
        this.router.navigate(['/hotel']);
      },
      error => {
        validationHandler(error, this.registerForm);
      }
    )
  }
}
