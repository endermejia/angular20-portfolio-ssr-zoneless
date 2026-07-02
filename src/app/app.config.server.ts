import { provideServerRendering } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig, TransferState, makeStateKey } from '@angular/core';
import { appConfig } from './app.config';
import { UNIVERSAL_PROVIDERS } from '@ng-web-apis/universal';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import { readFileSync } from 'fs';

// Define interface for translation data
interface TranslationData {
  [key: string]: string | TranslationData;
}

// Custom TranslateLoader for SSR that loads translations from filesystem
export class TranslateServerLoader implements TranslateLoader {
  constructor(
    private transferState: TransferState,
    private prefix = 'i18n',
    private suffix = '.json',
  ) {}

  getTranslation(lang: string): Observable<TranslationData> {
    try {
      // During SSR, we need to load the translations from the filesystem
      const path = join(
        process.cwd(),
        'public',
        this.prefix,
        `${lang}${this.suffix}`,
      );
      const content = readFileSync(path, 'utf8');
      const data = JSON.parse(content) as TranslationData;
      
      // Store in TransferState for client-side bootstrapping
      const key = makeStateKey<TranslationData>('translation-' + lang);
      this.transferState.set(key, data);
      
      return of(data);
    } catch (error) {
      console.error(`Error loading translation file for ${lang}:`, error);
      return of({});
    }
  }
}

// Factory function to create the server-side TranslateLoader
export function translateServerLoaderFactory(transferState: TransferState): TranslateLoader {
  return new TranslateServerLoader(transferState);
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    UNIVERSAL_PROVIDERS,
    // Override the TranslateLoader for server-side rendering
    {
      provide: TranslateLoader,
      useFactory: translateServerLoaderFactory,
      deps: [TransferState],
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
