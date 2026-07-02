import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { TUI_LANGUAGE } from '@taiga-ui/i18n';
import { toObservable } from '@angular/core/rxjs-interop';
import { GlobalData } from '../services';
import { Observable, of } from 'rxjs';

import { routes } from './app.routes';

export class TranslateBrowserLoader implements TranslateLoader {
  constructor(
    private transferState: TransferState,
    private http: HttpClient,
    private prefix: string = '/i18n/',
    private suffix: string = '.json',
  ) {}

  getTranslation(lang: string): Observable<any> {
    const key = makeStateKey<any>('translation-' + lang);
    const data = this.transferState.get(key, null);
    if (data) {
      return of(data);
    }
    const httpLoader = new TranslateHttpLoader(this.http, this.prefix, this.suffix);
    return httpLoader.getTranslation(lang);
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
    provideAnimations(),
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
    provideEventPlugins(),
    {
      provide: TUI_LANGUAGE,
      useFactory: (globalService: GlobalData) => {
        return toObservable(globalService.tuiLanguage);
      },
      deps: [GlobalData],
    },
  ],
};
