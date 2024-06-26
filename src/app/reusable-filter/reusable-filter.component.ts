import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import dayjs from 'dayjs';
import { debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Filter } from '../models/reusable-filter.model';
import { ReusableFilterService } from './reusable-filter.service';

@Component({
  selector: 'app-reusable-filter',
  templateUrl: './reusable-filter.component.html',
  styleUrls: ['./reusable-filter.component.scss'],
})
export class ReusableFilterComponent<T> implements OnInit, OnDestroy {
  filterForm: FormGroup;
  isSetFilterName: string[] = [];
  autoCompleteFilteredOptionsAPI: Observable<string[]>[] = [];

  get filtersControl() {
    return (this.filterForm.get('filters') as FormArray).controls;
  }

  /**
   * The name of the table to filter. Only used for fetching mock data.
   * Can be omitted if not needed in the future.
   */
  @Input() tableName = '';

  /** The list of filters to be displayed in the filter menu. */
  @Input() filters: Filter[];

  /**
   * The list of time stamp filters to be displayed in the filter menu.
   * Used to determine if the filter is a time filter.
   */
  @Input() timeStampFilters: string[];

  /** Event emitted to parent component when the filter is applied. */
  @Output() readonly applyFilter = new EventEmitter<T>();

  constructor(
    private _cdr: ChangeDetectorRef,
    private _reusableFilterService: ReusableFilterService
  ) {}

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      filters: new FormArray([]),
    });
  }

  ngOnDestroy(): void {
    this.removeFilterConfig();
  }

  /**
   * Capitalizes the first letter of a string.
   *
   * @param str - The string to capitalize.
   * @returns The input string with the first letter capitalized.
   */
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Sets the filter for the specified index and updates the component state.
   *
   * @param setFilterTrigger - The MatMenuTrigger used to close the filter menu.
   * @param filter - The filter object to be set.
   * @param index - The index of the filter in the filters array.
   */
  onSetFilter(setFilterTrigger: MatMenuTrigger, filter: Filter, index: number): void {
    // update isSet property of the filter object
    filter.isSet = true;
    this.filters[index] = filter;

    // update isSetFilterName array with the filter name
    this.isSetFilterName.push(filter.name);

    // assign the filter to the form group
    this.assignToFormGroup(filter, this.filtersControl.length);

    // detect changes
    this._cdr.detectChanges();

    // close the filter menu options
    setFilterTrigger.closeMenu();
  }

  /**
   * Assigns a filter to the form group based on its type.
   *
   * @param filter - The filter object to assign.
   * @param index - The index of the filter in the array.
   */
  assignToFormGroup(filter: Filter, index: number): void {
    switch (filter.type) {
      case 'autoComplete':
        this.assignStringFilter(index, filter, true);
        break;
      case 'string':
        this.assignStringFilter(index, filter, false);
        break;
      case 'selection':
        this.assignSelectionFilter(filter);
        break;
      case 'time':
        this.assignTimeFilter(filter);
        break;
    }
  }

  /**
   * Deletes a filter at the specified index and updates the filter state.
   * @param index - The index of the filter to delete.
   * @param filterType - The type of the filter to delete.
   */
  onDeleteOneFilter(index: number, filterType: string): void {
    const filter = this.findFilter(index);
    const resetIdx = this.filters.findIndex((f) => f.name === filter.name);
    this.filters[resetIdx].isSet = false;
    this.removeControl(index, filterType);
    this.isSetFilterName.splice(index, 1);
  }

  /**
   * Removes a control from the filterForm at the specified index.
   * If the filterType is 'autoComplete', it also deletes the corresponding autoCompletefilteredOptionsAPI entry.
   *
   * @param index - The index of the control to be removed.
   * @param filterType - The type of the filter.
   */
  removeControl(index: number, filterType: string): void {
    const control = this.filterForm.get('filters') as FormArray;
    control.removeAt(index);
    if (filterType === 'autoComplete') {
      // delete this.autoCompletefilteredOptionsAPI[index];
      this.autoCompleteFilteredOptionsAPI.splice(index, 1);
    }
  }

  /**
   * Finds the AdTableFilter object based on the given index.
   *
   * @param index - The index of the filter.
   * @returns The AdTableFilter object that matches the filter name at the given index.
   */
  findFilter(index: number): Filter {
    const filterName = this.isSetFilterName[index];
    return this.filters.find((f) => f.name === filterName) as Filter;
  }

  /**
   * Manages the auto-complete options for a specific control in the filtersControl array.
   * @param index - The index of the control in the filtersControl array.
   * @param controlName - The name of the control.
   */
  manageAutoCompleteOptionsControlAPI(index: number, controlName: string): void {
    const control = this.filtersControl[index].get(controlName);
    this.autoCompleteFilteredOptionsAPI[index] = control
      ? control.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          switchMap((value) => this._filterAutoCompleteOptionsMockAPI(value || '', controlName))
        )
      : of([]);
  }

  /**
   * Filters the autocomplete options based on the given value and URL.
   * @param value - The value to filter the options.
   * @param url - The URL to fetch the options from.
   * @returns An Observable that emits an array of filtered options.
   */
  private _filterAutoCompleteOptionsAPI(value: string, url: string): Observable<string[]> {
    if (value === '' || value.length < 4) {
      return of([]);
    }
    const filterValue = value.toLowerCase();

    return this._reusableFilterService.getFromUrl(url).pipe(
      map((res) => {
        return res.filter((option) => option.toLowerCase().includes(filterValue));
      })
    );
  }

  /**
   * Filters the autocomplete options based on the provided value and requested mock data.
   * Can be removed once the API is implemented.
   * @param value - The value to filter the options with.
   * @param dataType - The requested mock data of the options.
   * @returns An Observable that emits an array of filtered options.
   */
  private _filterAutoCompleteOptionsMockAPI(value: string, dataType: string): Observable<string[]> {
    const filterValue = value.toLowerCase();

    return this._reusableFilterService.getMockData(this.tableName, dataType).pipe(
      map((res) => {
        return res.filter((option) => option.toLowerCase().includes(filterValue));
      })
    );
  }

  /**
   * Retrieves the selected time filter value at the specified index.
   *
   * @param index - The index of the filter control.
   * @returns The selected time filter value (either "max", "min", "minMax", or "between").
   */
  selectedTimeFilter(index: number): any {
    const control = this.filtersControl[index].get('timeSelector') as FormControl;
    return control.value;
  }

  /**
   * Handles the selection change event for the time filter.
   * Sets the appropriate values for the date and time inputs based on the selected time filter.
   *
   * @param index - The index of the selected time filter.
   */
  timeFilterSelectionChange(index: number): void {
    const timeSelector = this.selectedTimeFilter(index);
    const date = dayjs().startOf('day').toISOString();
    const dateTime = this.filtersControl[index].get('dateTime') as FormControl;
    const min = this.filtersControl[index].get('min') as FormControl;
    const max = this.filtersControl[index].get('max') as FormControl;

    if (timeSelector === 'between') {
      min.setValue(new Date(date));
      max.setValue(new Date(Date()));
    } else {
      dateTime.setValue(new Date(date));
    }
  }

  /**
   * Assigns a string filter to the specified index in the filtersControl array.
   * If isAutoComplete is true, it also manages the autocomplete options control for the filter.
   *
   * @param index - The index in the filtersControl array where the filter should be assigned.
   * @param filter - The AdTableFilter object representing the filter to be assigned.
   * @param isAutoComplete - A boolean indicating whether the filter should have autocomplete options.
   */
  assignStringFilter(index: number, filter: Filter, isAutoComplete: boolean): void {
    const fg = new FormGroup({
      [filter.name]: new FormControl('', [Validators.required]),
    });
    this.filtersControl.push(fg);
    if (isAutoComplete) {
      const controlName = this.findFilter(index)?.name || '';
      this.manageAutoCompleteOptionsControlAPI(index, controlName);
    }
  }

  /**
   * Assigns a selection filter to the component.
   *
   * @param filter - The filter to assign.
   */
  assignSelectionFilter(filter: Filter): void {
    const fg = new FormGroup({
      [filter.name]: new FormControl(null, [Validators.required]),
    });
    this.filtersControl.push(fg);
  }

  /**
   * Assigns a time filter to the component.
   *
   * @param filter - The filter to assign.
   */
  assignTimeFilter(filter: Filter): void {
    const fg = new FormGroup({
      name: new FormControl(filter.name),
      timeSelector: new FormControl(null, [Validators.required]),
      dateTime: new FormControl(null, [Validators.required]),
      min: new FormControl(null, [Validators.required]),
      max: new FormControl(null, [Validators.required]),
    });
    this.filtersControl.push(fg);
  }

  /**
   * Applies the selected filters and emits the final filter object to parent component.
   *
   * @param filterTrigger - The MatMenuTrigger used to close the filter menu.
   */
  onApplyFilter(): void {
    // get filters raw value from filterForm
    const filterValue = this.filterForm.getRawValue().filters;

    // create the final filter object
    const finalFilter = filterValue.reduce((finalFilterObj: any, f: any) => {
      // create a copy of the filter object
      let copy = { ...f };

      // remap the time filter if the timeSelector property is present
      if (f.timeSelector) {
        copy = this.remapTimeFilter(copy, f);
      }

      // return the final filter object
      return { ...finalFilterObj, ...copy };
    }, {});

    // emit the final filter object to the parent component
    this.applyFilter.emit(finalFilter);
  }

  /**
   * Remaps the time filter based on the provided parameters.
   * @param copy - The object to be remapped.
   * @param f - The filter object containing the timeSelector and name properties.
   * @returns The remapped object.
   */
  remapTimeFilter(copy: any, f: any): any {
    // set the min and max properties to the dateTime property if the timeSelector is 'minMax'
    if (f.timeSelector === 'minMax') {
      copy.min = copy.dateTime;
      copy.max = copy.dateTime;
    }

    // find the keys related to time filter in the copy object
    const timeKeys = Object.keys(copy).filter((key) => key !== 'timeSelector' && key !== 'name');

    // filter the time keys based on the timeSelector property
    const filteredTimeKeys = timeKeys.filter((key) => {
      if (f.timeSelector === 'minMax' || f.timeSelector === 'between') {
        return key === 'min' || key === 'max';
      }
      return key === 'dateTime';
    });

    // remap the time filter based on the timeSelector property
    copy = filteredTimeKeys.reduce((timeObj: any, key: string) => {
      const timeKey =
        f.timeSelector === 'minMax' || f.timeSelector === 'between'
          ? key + this.capitalizeFirstLetter(f.name)
          : f.timeSelector + this.capitalizeFirstLetter(f.name);
      timeObj[timeKey] = dayjs(copy[key]).unix();
      return timeObj;
    }, {});

    // delete the timeSelector property
    delete copy.timeSelector;

    return copy;
  }

  /** Clears the filter configuration and emits nothing to parent component. */
  onClearFilter(): void {
    this.removeFilterConfig();
    this.applyFilter.emit();
  }

  /** Removes the filter configuration by resetting the filters and form controls. */
  removeFilterConfig(): void {
    this.filters.forEach((filter) => (filter.isSet = false));
    this.isSetFilterName = [];
    this.filterForm.setControl('filters', new FormArray([]));
    this.filterForm.reset();
    this.autoCompleteFilteredOptionsAPI = [];
  }
}
