import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorage } from './local-storage';

interface User {
  name: string;
  picture: string;
}

export interface SearchItem {
  href: string;
  title: string;
  subtitle?: string;
  icon?: string;
}
export type SearchData = Record<string, readonly SearchItem[]>;

export interface OptionsItem {
  name: string;
  icon: string;
  fn?: (item: OptionsItem) => void;
}
export type OptionsData = Record<string, readonly OptionsItem[]>;

@Injectable({
  providedIn: 'root',
})
export class GlobalData {
  private translate = inject(TranslateService);
  private router = inject(Router);
  private localStorage = inject(LocalStorage);

  headerTitle: WritableSignal<string> = signal('Portfolio');
  user: WritableSignal<User> = signal({
    name: 'Gabriel Mejía',
    picture: 'avatar.webp',
  });

  selectedLanguage: WritableSignal<'es' | 'en'> = signal('es');
  selectedTheme: WritableSignal<'light' | 'dark'> = signal('light');

  drawer: WritableSignal<OptionsData> = signal({
    Navigation: [
      {
        name: 'Home',
        icon: '@tui.home',
        fn: () => {
          if (typeof window !== 'undefined') {
            document
              ?.querySelector('#profile')
              ?.scrollIntoView({ behavior: 'smooth' });
          }
        },
      },
      {
        name: 'Experience',
        icon: '@tui.briefcase',
        fn: () => {
          if (typeof window !== 'undefined') {
            document
              ?.querySelector('#experience')
              ?.scrollIntoView({ behavior: 'smooth' });
          }
        },
      },
      {
        name: 'Certifications',
        icon: '@tui.file',
        fn: () => {
          if (typeof window !== 'undefined') {
            document
              ?.querySelector('#certifications')
              ?.scrollIntoView({ behavior: 'smooth' });
          }
        },
      },
      {
        name: 'Projects',
        icon: '@tui.layers',
        fn: () => {
          if (typeof window !== 'undefined') {
            document
              ?.querySelector('#projects')
              ?.scrollIntoView({ behavior: 'smooth' });
          }
        },
      },
      {
        name: 'Contact',
        icon: '@tui.send',
        fn: () => {
          if (typeof window !== 'undefined') {
            document
              ?.querySelector('#contact')
              ?.scrollIntoView({ behavior: 'smooth' });
          }
        },
      },
    ],
  });

  settings: Signal<OptionsData> = computed(() => ({
    preferences: [
      {
        name: 'settings.language',
        icon: this.selectedLanguage() === 'es' ? '🇪🇸' : '🇬🇧',
        fn: () => this.switchLanguage(),
      },
      {
        name: 'settings.theme',
        icon: this.selectedTheme() === 'dark' ? '☀️' : '🌙',
        fn: () => this.switchTheme(),
      },
    ],
  }));

  searchPopular: WritableSignal<string[]> = signal(['GitHub', 'LinkedIn']);
  searchData: WritableSignal<SearchData> = signal({
    Social: [
      {
        title: 'GitHub',
        href: 'https://github.com/endermejia',
        icon: '@tui.github',
      },
      {
        title: 'LinkedIn',
        href: 'https://www.linkedin.com/in/gabrimejia/',
        icon: '@tui.linkedin',
      },
    ],
    Portfolio: [
      {
        title: 'Experience',
        href: '#experience',
        icon: '@tui.briefcase',
      },
      {
        title: 'Certifications',
        href: '#certifications',
        icon: '@tui.file',
      },
      {
        title: 'Projects',
        href: '#projects',
        icon: '@tui.layers',
      },
      {
        title: 'Contact',
        href: '#contact',
        icon: '@tui.send',
      },
    ],
  });

  switchLanguage(): void {
    this.selectedLanguage.set(this.selectedLanguage() === 'es' ? 'en' : 'es');
    this.translate.use(this.selectedLanguage());
    this.localStorage.setItem('language', this.selectedLanguage());
  }

  switchTheme(): void {
    this.selectedTheme.set(this.selectedTheme() === 'dark' ? 'light' : 'dark');
    this.localStorage.setItem('theme', this.selectedTheme());
  }
}
