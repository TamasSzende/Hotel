import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [],
  exports: [FormsModule, MatDialogModule, MatButtonModule, MatInputModule],
  imports: [
    CommonModule
  ]
})
export class MaterialModule {
}
