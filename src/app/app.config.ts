import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import {HttpClient, provideHttpClient, withFetch} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {provideTranslateService, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideEventPlugins} from '@taiga-ui/event-plugins';
import {TUI_LANGUAGE} from '@taiga-ui/i18n';
import {toObservable} from '@angular/core/rxjs-interop';
import {GlobalServiceService} from '../services';

import {routes} from './app.routes';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient,
) => new TranslateHttpLoader(http, '/i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'es',
    }),
    provideEventPlugins(),
    {
      provide: TUI_LANGUAGE,
      useFactory: (globalService: GlobalServiceService) => {
        return toObservable(globalService.tuiLanguage);
      },
      deps: [GlobalServiceService],
    },
  ],
};
