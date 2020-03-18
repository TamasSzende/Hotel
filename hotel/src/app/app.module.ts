import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RoomFormComponent} from './components/room-form/room-form.component';
import {HotelListComponent} from "./components/hotel-list/hotel-list.component";
import {HotelFormComponent} from "./components/hotel-form/hotel-form.component";
import {HotelDetailsComponent} from "./components/hotel-detail/hotel-details.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {RoomDetailsComponent} from './components/room-details/room-details.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {PopupComponent} from './popup/popup.component';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {MaterialModule} from "./material.module";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {CloudinaryModule} from "@cloudinary/angular-5.x";
import * as  Cloudinary from 'cloudinary-core';
import {Ng2FlatpickrModule} from "ng2-flatpickr";
import {BookingFormDialogComponent} from "./components/hotel-detail/booking-form-dialog/booking-form-dialog.component";
import {LoginFormComponent} from "./components/login-form/login-form.component";
import {HttpRequestInterceptor} from "./utils/httpRequestInterceptor";
import {FileUploadModule} from "ng2-file-upload";
import { HotelImageManagerComponent } from './components/hotel-form/hotel-image-manager/hotel-image-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RoomFormComponent,
    RoomDetailsComponent,
    HotelFormComponent,
    HotelListComponent,
    HotelDetailsComponent,
    RegistrationComponent,
    PopupComponent,
    BookingFormDialogComponent,
    LoginFormComponent,
    HotelImageManagerComponent,
  ],
    imports: [
        HttpClientModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        MatIconModule,
        MatDialogModule,
        MDBBootstrapModule,
        CloudinaryModule.forRoot(Cloudinary, {cloud_name: 'doaywchwk'}),
        Ng2FlatpickrModule,
        FileUploadModule
    ],
  providers: [[
    {provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true}
  ],],
  bootstrap: [AppComponent],
  entryComponents: [PopupComponent]
})
export class AppModule {
}
