import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { memberFilters } from "./mock-data/filter-mock-data";

/**
 * @title Highlight the first autocomplete option
 */
@Component({
  selector: "parent",
  templateUrl: "parent.component.html",
  styleUrls: ["parent.component.scss"],
})
export class ParentComponent implements OnInit {
  // myControl = new FormControl("");
  // options: string[] = ["One", "Two", "Three"];
  // filteredOptions: Observable<string[]>;

  // ngOnInit() {
  //   this.filteredOptions = this.myControl.valueChanges.pipe(
  //     startWith(""),
  //     map((value) => this._filter(value || ""))
  //   );
  // }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter((option) =>
  //     option.toLowerCase().includes(filterValue)
  //   );
  // }

  filters = memberFilters;

  ngOnInit() {}
}

/**  Copyright 2024 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */
