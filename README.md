# Reusable Filter Template using Angular Form Array

This project is demo for reusable filter template component used to filter a table record that allows users to build dynamic filters with various input types. It leverages Angular's reactive forms and Form Arrays to create a flexible and adaptable solution.

Developed using Angular and Angular Material v14.

## Features

- **Multiple Input Types:** Supports autocomplete, plain string, dropdown selector, and time inputs for diverse filtering needs.
- **Reusable Component:** Can be used across different parts of your application to create consistent filtering experiences.
- **Configurable:** Define filter options through a configuration object passed to the component.
- **JSON Output:** Generates a JSON object containing key-value pairs representing the selected filter criteria. This object is emitted to the parent component and can be appended to query parameters for data retrieval.

## Running the program

1. Clone the repository

```bash
git clone https://github.com/liemwellys/reusable-filter-form-array.git
```

2. Install required packages

```bash
npm install --no-save
```

## Filter Usage & Configuration

1. Prepare a filter config & a timestamp filter config.

```typescript
// filter config
export const memberfilters: Filter[] = [
  {
    type: 'autoComplete',
    name: 'name',
    label: 'member.name',
    isSet: false,
    // autoCompleteUrl: '/path/to/data/retrieval/on/configured/API/provider'
  },
  {
    type: 'string',
    name: 'address',
    label: 'member.address',
    isSet: false,
  },
  {
    type: 'autoComplete',
    name: 'district',
    label: 'member.district',
    isSet: false,
    // autoCompleteUrl: '/path/to/data/retrieval/on/configured/API/provider'
  },
  {
    type: 'selection',
    name: 'city',
    label: 'member.city',
    options: [
      { name: 'London', value: 'London' },
      { name: 'Manchester', value: 'Manchester' },
      { name: 'Birmingham', value: 'Birmingham' },
      { name: 'Leeds', value: 'Leeds' },
      { name: 'Liverpool', value: 'Liverpool' },
      { name: 'Newcastle', value: 'Newcastle' },
      { name: 'Nottingham', value: 'Nottingham' },
    ],
    isSet: false,
  },
  {
    type: 'time',
    name: 'createdAt',
    label: 'member.createdAt',
    options: [
      { name: 'filterMenu.before', value: 'max' },
      { name: 'filterMenu.after', value: 'min' },
      { name: 'filterMenu.at', value: 'minMax' },
      { name: 'filterMenu.between', value: 'between' },
    ],
    isSet: false,
  },
];

// timestamp filter config
export const memberTimeStampFilters = ['createdAt'];
```

2. Add reusable filter component into a parent component template & bind `memberFilters` & `memberTimeStampFilters` on each corresponding property binding.

```html
<app-reusable-filter
  [filters]="memberFilters"
  [timeStampFilters]="memberTimeStampFilters"
></app-reusable-filter>
```

- **Optional:** Bind a table name to retrieve preset mock data. Since the current project does not have an API provider, the mock table name is set to `member` and implementing mock data retrieval using [`_filterAutoCompleteOptionsMockAPI`](src/app/reusable-filter/reusable-filter.component.ts#L231). The function for data retrieval from the API provider has already been set up in [`_filterAutoCompleteOptionsAPI`](src/app/reusable-filter/reusable-filter.component.ts#L211) and needs to be configured based on your project setup.

```html
<app-reusable-filter ... [table]="'member'"></app-reusable-filter>
```

3. Add a variable & method in parent component for store the emitted filter object from reusable filter component.

```typescript
export class ParentComponent implements OnInit {
  ...

  // variable for store emitted filter object
  filterObject: unknown;

  /**
   * a method to receive & store filter object
   * optional: send GET request to configured API provider
   * once filter received on parent component
   */
  receiveFilter(filter: unknown): void {
    this.filterObject = filter;
  }
}
```

4. Bind `receiveFilter()` method with `applyFilter` event.

```html
<app-reusable-filter ... (applyFilter)="receiveFilter($event)"></app-reusable-filter>
```

## Sample Output

The following example is a sample output when the user fills out all of the defined available filter fields. It demonstrates how the filter criteria are represented in a JSON object. In this case, the user has entered the following filter values:

- Name: John Smith
- Address: No. 18, Lane 71
- District: Southwark
- City: Nottingham
- Created before: 2024/06/27 00:00

The JSON object generated from these filter values is as follows:

```json
{
  "name": "John Smith",
  "address": "No. 18, Lane 71",
  "district": "Southwark",
  "city": "Nottingham",
  "maxCreatedAt": 1719417600
}
```

For the time filter, the filter key's name will be the time constraint selection followed by the filter name. In this case, since the user selected the "Before" time constraint and the filter name is "createdAt", the key's name will be `maxCreatedAt`.

The other possible keys based on the user's selection are as follows:

- After: `minCreatedAt`

```json
{
  "minCreatedAt": 1719417600
}
```

- At: `minCreatedAt` and `maxCreatedAt`

```json
{
  "minCreatedAt": 1719417600,
  "maxCreatedAt": 1719417600
}
```

- Between: `minCreatedAt` and `maxCreatedAt`

```json
{
  "minCreatedAt": 1719417600,
  "maxCreatedAt": 1719489367
}
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
