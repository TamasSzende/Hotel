import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoomFormComponent} from "./components/room-form/room-form.component";
import {RoomDetailsComponent} from "./components/room-details/room-details.component";
import {HotelListComponent} from "./components/hotel-list/hotel-list.component";
import {HotelFormComponent} from "./components/hotel-form/hotel-form.component";
import {HotelDetailsComponent} from "./components/hotel-detail/hotel-details.component";
import {RegistrationComponent} from "./components/account/registration/registration.component";
import {LoginComponent} from "./components/account/login/login.component";
import {ConfirmationComponent} from "./components/account/confirmation/confirmation.component";
import {AccountDetailsComponent} from "./components/account/account-details/account-details.component";
import {HotelBookingsComponent} from "./components/hotel-bookings/hotel-bookings.component";
import {UserBookingsComponent} from "./components/user-bookings/user-bookings.component";
import {AccountEditComponent} from "./components/account/account-edit/account-edit.component";


const routes: Routes = [
  {path: 'hotel/:id', component: HotelDetailsComponent},
  {path: 'hotel', component: HotelListComponent},
  {path: "account-edit", component: AccountEditComponent},
  {path: "account", component: AccountDetailsComponent},
  {path: 'bookings', component: UserBookingsComponent},
  {path: "admin/hotel/update-room/:id", component: RoomFormComponent},
  {path: "admin/hotel/create-room", component: RoomFormComponent},
  {path: "admin/hotel/room/:id", component: RoomDetailsComponent},
  {path: "admin/hotel/bookings", component: HotelBookingsComponent},
  {path: 'admin/hotel-create', component: HotelFormComponent},
  {path: 'admin/hotel-update', component: HotelFormComponent},
  {path: 'admin/hotel', component: HotelDetailsComponent},
  {path: "registrations", component: RegistrationComponent},
  {path: 'login/:token', component: ConfirmationComponent},
  {path: "login", component: LoginComponent},
  {path: "", component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
