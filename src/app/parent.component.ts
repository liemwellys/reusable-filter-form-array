import { Component, OnInit } from '@angular/core';
import { memberFilters, memberTimeStampFilters } from './mock-data/filter-mock-data';

/**
 * @title Highlight the first autocomplete option
 */
@Component({
  selector: 'parent',
  templateUrl: 'parent.component.html',
  styleUrls: ['parent.component.scss'],
})
export class ParentComponent implements OnInit {
  filters = memberFilters;
  timeStampFilters = memberTimeStampFilters;
  filterObject: unknown;

  ngOnInit() {}

  receiveFilter(filter: unknown): void {
    this.filterObject = filter;
  }
}

/**  Copyright 2024 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */
