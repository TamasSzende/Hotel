import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoomListComponent} from "./components/room-list/room-list.component";
import {RoomFormComponent} from "./components/room-form/room-form.component";
import {RoomDetailsComponent} from "./components/room-details/room-details.component";
import {HotelListComponent} from "./components/hotel-list/hotel-list.component";
import {HotelFormComponent} from "./components/hotel-form/hotel-form.component";
import {HotelDetailsComponent} from "./components/hotel-detail/hotel-details.component";
import {RegistrationComponent} from "./components/registration/registration.component";


const routes: Routes = [
  {path: "", component: HotelListComponent},
  {path: "room-list", component: RoomListComponent},
  {path: "room-form", component: RoomFormComponent},
  {path: "room-details/:id", component: RoomDetailsComponent},
  {path: 'hotel-list', component: HotelListComponent},
  {path: 'hotel-form', component: HotelFormComponent},
  {path: 'hotel-form/:id', component: HotelFormComponent},
  {path: 'hotel-detail/:id', component: HotelDetailsComponent},
  {path: "registration", component: RegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
