import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mockDisctrict, mockName } from '../mock-data/filter-mock-data';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReusableFilterService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves data used on auto complete form based on the specified URL with pagination parameters.
   * @param url - The URL to retrieve data from.
   * @param pageIndex - The page index for pagination (default: 1).
   * @param pageSize - The page size for pagination (default: 25).
   * @returns An Observable that emits an array of strings.
   */
  getFromUrl(url: string, pageIndex: number = 1, pageSize: number = 25): Observable<string[]> {
    const headers = new HttpHeaders({ type: 'meterData' });
    let params = new HttpParams();

    params = params.append('page', pageIndex);
    params = params.append('limit', pageSize);
    params = params.append('sortBy', 'record_time');
    params = params.append('sortOrder', 'desc');

    return this.http.get<string[]>(`${url}?${params}`, { headers });
  }

  /**
   * Retrieves mock data based on the provided table name. Can be removed once the API is implemented.
   * @param tableName - The name of the table.
   * @param mockData - The mock data to be retrieved.
   * @returns An Observable that emits an array of strings representing the mock data.
   */
  getMockData(tableName: string, mockData: string): Observable<string[]> {
    switch (tableName) {
      case 'member':
        return this.memberMockData(mockData);
      default: {
        return of([]);
      }
    }
  }

  /**
   * Returns an observable of string array based on the provided mock data type related to member.
   * @param mockData - The type of mock data to retrieve.
   * @returns An Observable array of strings representing mock data related to member.
   */
  memberMockData(mockData: string): Observable<string[]> {
    switch (mockData) {
      case 'name':
        return of(mockName);
      case 'district':
        return of(mockDisctrict);
      default:
        return of([]);
    }
  }
}
