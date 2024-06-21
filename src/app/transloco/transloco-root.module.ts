import { APP_INITIALIZER, NgModule } from "@angular/core";
import {
  provideTransloco,
  Translation,
  TranslocoModule,
  TranslocoService,
} from "@ngneat/transloco";
import { Observable } from "rxjs";
import { languageList } from "./language-list";
import { TranslocoHttpLoader } from "./transloco-http-loader";

/**
 * Preloads translation for the application.
 *
 * @param translocoService - The TranslocoService instance used for translation.
 * @returns A function that returns an Observable of the loaded translation.
 */
export function preloadTranslation(
  translocoService: TranslocoService
): () => Observable<Translation> {
  return () => {
    const defaultLang = translocoService.getDefaultLang();
    translocoService.setActiveLang(defaultLang);
    return translocoService.load(defaultLang);
  };
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    // Provide the default Transloco configuration
    provideTransloco({
      config: {
        availableLangs: languageList,
        defaultLang: "zh-TW",
        fallbackLang: "zh-TW",
        reRenderOnLangChange: true,
        prodMode: true,
      },
      loader: TranslocoHttpLoader,
    }),

    {
      // Preload the default language before the app starts to prevent empty/jumping content
      provide: APP_INITIALIZER,
      deps: [TranslocoService],
      useFactory: preloadTranslation,
      multi: true,
    },
  ],
})
export class TranslocoRootModule {}
