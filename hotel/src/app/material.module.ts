import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [],
  exports: [FormsModule, MatDialogModule, MatButtonModule, MatInputModule],
  imports: [
    CommonModule
  ]
})
export class MaterialModule {
}
