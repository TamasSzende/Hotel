import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RoomFormComponent} from './components/room-form/room-form.component';
import {RoomListComponent} from './components/room-list/room-list.component';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {RoomDetailsComponent} from './components/room-details/room-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RoomFormComponent,
    RoomListComponent,
    RoomDetailsComponent
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
