import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {MailService} from "../../services/mail.service";
import {MailModel} from "../../models/mail.model";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private mailService: MailService, private router: Router) {
    this.registerForm = new FormGroup({
      'email': new FormControl(""),
      'password': new FormControl(""),
    });
  }

  submit() {
    let formData: MailModel = this.registerForm.value;
    this.mailService.registerMail(formData).subscribe(
      () => {
        this.registerForm.reset();
      }
    );
  }

  ngOnInit() {
  }

}
