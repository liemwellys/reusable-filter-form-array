import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Translation, TranslocoLoader } from "@ngneat/transloco";

@Injectable({
  providedIn: "root",
})
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private _httpClient: HttpClient) {}

  /**
   * Retrieves the translation for the specified language.
   * @param lang - The language code for the translation.
   * @returns A Promise that resolves to the translation data.
   */
  getTranslation(lang: string) {
    return this._httpClient.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}
