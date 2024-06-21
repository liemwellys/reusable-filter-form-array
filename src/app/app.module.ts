import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MaterialExampleModule } from "../material.module";
import { ParentComponent } from "./parent.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { HttpClientModule } from "@angular/common/http";
import { TranslocoRootModule } from "./transloco/transloco-root.module";
import { ReusableFilterComponent } from "./reusable-filter/reusable-filter.component";

@NgModule({
  declarations: [ParentComponent, ReusableFilterComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    TranslocoRootModule,
  ],
  providers: [],
  bootstrap: [ParentComponent],
})
export class AppModule {}
