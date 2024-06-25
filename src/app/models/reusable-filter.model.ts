export interface FilterOption {
  name: string;
  value: string;
}

export type FilterType = 'autoComplete' | 'string' | 'selection' | 'time';

export interface Filter {
  type: FilterType;
  name: string;
  label: string;
  autoCompleteUrl?: string;
  options?: FilterOption[];
  value?: string;
  isSet: boolean;
}
