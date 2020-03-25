import {Component, OnInit} from '@angular/core';
import {AccountDetailsForMyProfileModel} from "../../../models/AccountDetailsForMyProfile.model";
import {LoginService} from "../../../services/login.service";

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {

  account: AccountDetailsForMyProfileModel;

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
    const user = this.loginService.getUsername();
    this.loginService.getAccountDetails(user).subscribe(
      (userAccount: AccountDetailsForMyProfileModel) => {
        this.account = userAccount;
      }
    )
  }

  doEdit() {

  }
}
