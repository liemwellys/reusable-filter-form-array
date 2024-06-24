import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReusableFilterService {
  constructor() {}

  /**
   * Retrieves mock data based on the provided table name. Can be removed once the API is implemented.
   * @param tableName - The name of the table.
   * @param mockData - The mock data to be retrieved.
   * @returns An Observable that emits an array of strings representing the mock data.
   */
  getMockData(tableName: string, mockData: string): Observable<string[]> {
    switch (tableName) {
      case "member":
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
      case "city":
        return of([]);
      case "district":
        return of([]);
      default:
        return of([]);
    }
  }
}