import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoomFormComponent} from "./components/room-form/room-form.component";
import {RoomDetailsComponent} from "./components/room-details/room-details.component";
import {HotelListComponent} from "./components/hotel-list/hotel-list.component";
import {HotelFormComponent} from "./components/hotel-form/hotel-form.component";
import {HotelDetailsComponent} from "./components/hotel-detail/hotel-details.component";
import {RegistrationComponent} from "./components/registration/registration.component";


const routes: Routes = [
  {path: "", component: HotelListComponent},
  {path: 'hotel/:id', component: HotelDetailsComponent},
  {path: 'hotel', component: HotelListComponent}, //USED
  {path: "admin/hotel/update-room/:id", component: RoomFormComponent},
  {path: "admin/hotel/create-room", component: RoomFormComponent},
  {path: "admin/hotel/room/:id", component: RoomDetailsComponent},
  {path: 'admin/hotel-create', component: HotelFormComponent},
  {path: 'admin/hotel-update', component: HotelFormComponent},
  {path: 'admin/hotel', component: HotelDetailsComponent},
  {path: "registration", component: RegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
