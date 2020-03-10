import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RoomFormComponent} from './components/room-form/room-form.component';
import {HotelListComponent} from "./components/hotel-list/hotel-list.component";
import {HotelFormComponent} from "./components/hotel-form/hotel-form.component";
import {HotelDetailsComponent} from "./components/hotel-detail/hotel-details.component";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {RoomDetailsComponent} from './components/room-details/room-details.component';
import {RegistrationComponent} from './components/registration/registration.component';

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
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
