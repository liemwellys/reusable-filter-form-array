/** Dropdown selection filter option. */
export interface FilterOption {
  /** The name of the filter option. */
  name: string;

  /** The value of the filter option. */
  value: string;
}

/**
 * Represents the type of filter for a reusable filter.
 * Possible values are:
 * - 'autoComplete': Represents an autocomplete filter.
 * - 'string': Represents a string filter.
 * - 'selection': Represents a selection filter.
 * - 'time': Represents a time filter.
 */
export type FilterType = 'autoComplete' | 'string' | 'selection' | 'time';

/** Represents a filter used in a reusable filter form. */
export interface Filter {
  /** The type of the filter. */
  type: FilterType;

  /**
   * The name of the filter.
   * Make sure to set the filter name as specified by API provider
   * since it will be used as parameter for retrieve data from the API provider.
   */
  name: string;

  /** The label of the filter which will be rendered on HTML */
  label: string;

  /**
   * The URL for retreiving auto-complete data.
   * Applicable for autocomplete filter input field.
   * */
  autoCompleteUrl?: string;

  /**
   * The options for the filter.
   * Applicable for selection filter with dropdown options.
   */
  options?: FilterOption[];

  /** Indicates whether the filter is set or not on a Form Array. */
  isSet: boolean;
}
