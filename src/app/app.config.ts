import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, of } from 'rxjs';

import { routes } from './app.routes';

interface TranslationData {
  [key: string]: string | TranslationData;
}

export class TranslateBrowserLoader implements TranslateLoader {
  constructor(
    private transferState: TransferState,
    private http: HttpClient,
    private prefix = '/i18n/',
    private suffix = '.json',
  ) {}

  getTranslation(lang: string): Observable<TranslationData> {
    const key = makeStateKey<TranslationData>('translation-' + lang);
    const data = this.transferState.get(key, null);
    if (data) {
      return of(data as TranslationData);
    }
    const httpLoader = new TranslateHttpLoader(this.http, this.prefix, this.suffix);
    return httpLoader.getTranslation(lang) as Observable<TranslationData>;
  }
}

export function translateBrowserLoaderFactory(
  transferState: TransferState,
  http: HttpClient,
): TranslateLoader {
  return new TranslateBrowserLoader(transferState, http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: translateBrowserLoaderFactory,
        deps: [TransferState, HttpClient],
      },
      defaultLanguage: 'es',
    }),
  ],
};
