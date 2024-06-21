import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import {
  AutoCompleteFilteredOption,
  Filter,
} from "../models/reusable-filter.model";
import { MatMenuTrigger } from "@angular/material/menu";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { debounceTime, map, Observable, of, startWith, switchMap } from "rxjs";
import { ReusableFilterService } from "./reusable-filter.service";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "app-reusable-filter",
  templateUrl: "./reusable-filter.component.html",
  styleUrls: ["./reusable-filter.component.scss"],
})
export class ReusableFilterComponent<T> implements OnInit {
  filterForm: FormGroup;
  isSetFilterName: string[] = [];
  autoCompletefilteredOptionsAPI: AutoCompleteFilteredOption = {};

  get filtersControl() {
    return (this.filterForm.get("filters") as FormArray).controls;
  }

  /**
   * The name of the table to filter. Only used for fetching mock data.
   * Can be omitted if not needed in the future.
   */
  @Input() tableName = "";

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

  /**
   * Sets the filter for the specified index and updates the component state.
   *
   * @param setFilterTrigger - The MatMenuTrigger used to close the filter menu.
   * @param filter - The filter object to be set.
   * @param index - The index of the filter in the filters array.
   */
  onSetFilter(
    setFilterTrigger: MatMenuTrigger,
    filter: Filter,
    index: number
  ): void {
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

  assignToFormGroup(filter: Filter, index: number): void {
    switch (filter.type) {
      case "autoComplete":
        this.assignStringFilter(index, filter, true);
        break;
      // case 'string':
      //   this.assignStringFilter(index, filter, false);
      //   break;
      // case 'selection':
      //   this.assignSelectionFilter(filter);
      //   break;
      // case 'time':
      //   this.assignTimeFilter(filter);
      //   break;
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
  manageAutoCompleteOptionsControlAPI(
    index: number,
    controlName: string
  ): void {
    const control = this.filtersControl[index].get(controlName);
    this.autoCompletefilteredOptionsAPI[index] = control
      ? control.valueChanges.pipe(
          startWith(""),
          debounceTime(300),
          switchMap((value) =>
            this._filterAutoCompleteOptionsMockAPI(value || "", controlName)
          )
        )
      : of([]);
  }

  /**
   * Filters the autocomplete options based on the provided value and requested mock data.
   * Can be removed once the API is implemented.
   * @param value - The value to filter the options with.
   * @param dataType - The requested mock data of the options.
   * @returns An Observable that emits an array of filtered options.
   */
  private _filterAutoCompleteOptionsMockAPI(
    value: string,
    dataType: string
  ): Observable<string[]> {
    if (value === "" || value.length < 4) {
      return of([]);
    }
    const filterValue = value.toLowerCase();

    return this._reusableFilterService
      .getMockData(this.tableName, dataType)
      .pipe(
        map((res) => {
          return res.filter((option) =>
            option.toLowerCase().includes(filterValue)
          );
        })
      );
  }

  assignStringFilter(
    index: number,
    filter: Filter,
    isAutoComplete: boolean
  ): void {
    const fg = new FormGroup({
      [filter.name]: new FormControl("", [Validators.required]),
    });
    this.filtersControl.push(fg);
    if (isAutoComplete) {
      const controlName = this.findFilter(index)?.name || "";
      this.manageAutoCompleteOptionsControlAPI(index, controlName);
    }
  }
}
