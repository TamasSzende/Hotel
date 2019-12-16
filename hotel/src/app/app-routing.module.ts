import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoomListComponent} from "./components/room-list/room-list.component";
import {RoomFormComponent} from "./components/room-form/room-form.component";
import {RoomDetailsComponent} from "./components/room-details/room-details.component";


const routes: Routes = [
  {path: "", component: RoomListComponent},
  {path: "room-list", component: RoomListComponent},
  {path: "room-form", component: RoomFormComponent},
  {path: "room-details/:id", component: RoomDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
