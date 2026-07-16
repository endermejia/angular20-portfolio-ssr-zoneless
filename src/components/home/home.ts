import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GlobalData } from '../../services';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  transform(url: string | undefined): SafeResourceUrl {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
  }
}

@Pipe({ name: 'expDate' })
export class ExpDatePipe implements PipeTransform {
  private global = inject(GlobalData);
  transform(isoStr: string | undefined): string {
    if (!isoStr) return '';
    const date = new Date(isoStr);
    const lang = this.global.selectedLanguage() === 'es' ? 'es-ES' : 'en-US';
    return new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric' }).format(date);
  }
}

@Pipe({ name: 'expDuration' })
export class ExpDurationPipe implements PipeTransform {
  private global = inject(GlobalData);
  transform(startStr: string, endStr?: string): string {
    const start = new Date(startStr);
    const end = endStr ? new Date(endStr) : new Date();
    const yearsDiff = end.getFullYear() - start.getFullYear();
    const monthsDiff = end.getMonth() - start.getMonth();
    let totalMonths = yearsDiff * 12 + monthsDiff;
    if (totalMonths < 1) totalMonths = 1;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const isEs = this.global.selectedLanguage() === 'es';
    const parts = [];
    if (years > 0) parts.push(years === 1 ? (isEs ? '1 año' : '1 yr') : `${years} ${isEs ? 'años' : 'yrs'}`);
    if (months > 0) parts.push(months === 1 ? (isEs ? '1 mes' : '1 mo') : `${months} ${isEs ? 'meses' : 'mos'}`);
    return parts.join(' ');
  }
}

interface Experience {
  company: string;
  role: string;
  employment: string;
  startDate: string;
  endDate?: string;
  location?: string;
  descriptionKey?: string;
  skills?: string[];
}

interface Certification {
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  logo?: string;
  skills?: string[];
}

interface Tag {
  name: string;
  icon?: string;
}

interface Project {
  name: string;
  repoUrl: string;
  siteUrl?: string;
  siteName?: string;
  tags?: Tag[];
  bgImage?: string;
}

@Component({
  selector: 'app-home',
  imports: [TranslatePipe, SafeUrlPipe, ExpDatePipe, ExpDurationPipe, ScrollRevealDirective],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class HomeComponent {
  protected readonly github = signal('https://github.com/endermejia');
  protected readonly linkedin = signal('https://www.linkedin.com/in/gabrimejia/');
  protected readonly instagram = signal('https://www.instagram.com/gabri.mejia/');

  protected readonly global = inject(GlobalData);

  // Project Carousel State
  protected readonly currentProjectIndex = signal(2);

  protected readonly currentProject = computed(() => {
    const projs = this.projects();
    return projs[this.currentProjectIndex() % projs.length];
  });

  protected nextProject(): void {
    const total = this.projects().length;
    this.currentProjectIndex.update((i) => (i + 1) % total);
  }

  protected prevProject(): void {
    const total = this.projects().length;
    this.currentProjectIndex.update((i) => (i - 1 + total) % total);
  }

  protected goToProject(index: number): void {
    this.currentProjectIndex.set(index);
  }

  protected readonly totalYearsExperience = computed(() => {
    const exps = this.experiences();
    if (exps.length === 0) return 0;
    const now = new Date();
    let earliest = now;
    for (const exp of exps) {
      const start = new Date(exp.startDate);
      if (start < earliest) earliest = start;
    }
    const years = now.getFullYear() - earliest.getFullYear();
    const months = now.getMonth() - earliest.getMonth();
    return months < 0 ? years - 1 : years;
  });

  protected readonly experiences = signal<Experience[]>([
    {
      company: 'Inetum',
      role: 'Senior Angular Developer',
      employment: 'Full-time',
      startDate: '2025-06-01',
      location: 'Principado de Asturias',
      descriptionKey: 'home.experience.inetum',
      skills: ['Angular 22', 'SSR', 'Zoneless', 'Angular Material', 'i18n', 'Signals'],
    },
    {
      company: 'CONVOTIS Iberia',
      role: 'Angular Developer',
      employment: 'Full-time',
      startDate: '2024-06-01',
      endDate: '2025-06-01',
      location: 'Spain',
      descriptionKey: 'home.experience.convotis',
      skills: ['Angular 19', 'PrimeNG', 'RxJS', 'Signals'],
    },
    {
      company: 'Clavei - CLAVE INFORMATICA S.L.',
      role: 'Angular Developer',
      employment: 'Full-time',
      startDate: '2023-09-01',
      endDate: '2024-05-01',
      location: 'Spain',
      descriptionKey: 'home.experience.clavei',
      skills: ['Angular 19', 'PrimeNG', 'RxJS', 'Signals'],
    },
    {
      company: 'Ricoh España',
      role: 'Senior Frontend Developer',
      employment: 'Full-time',
      startDate: '2022-07-01',
      endDate: '2023-09-01',
      location: 'Asturias, Spain',
      descriptionKey: 'home.experience.ricoh',
      skills: ['Angular', 'TypeScript', 'HTML', 'CSS'],
    },
    {
      company: 'NTT DATA',
      role: 'Frontend Developer',
      employment: 'Full-time',
      startDate: '2019-12-01',
      endDate: '2022-07-01',
      location: 'Alacant, Spain',
      descriptionKey: 'home.experience.nttdata',
      skills: ['Angular', 'TypeScript'],
    },
  ]);

  protected readonly certifications = signal<Certification[]>([
    {
      title: 'Legacy Responsive Web Design',
      issuer: 'freeCodeCamp',
      issueDate: 'Oct 2020',
      credentialUrl: 'https://www.freecodecamp.org/certification/endermejia/responsive-web-design',
      skills: ['HTML', 'CSS', 'Responsive Design'],
    },
    {
      title: 'JavaScript Algorithms and Data Structures',
      issuer: 'freeCodeCamp',
      issueDate: 'Oct 2020',
      credentialUrl: 'https://www.freecodecamp.org/certification/endermejia/javascript-algorithms-and-data-structures',
      skills: ['JavaScript', 'Algorithms', 'Data Structures'],
    },
  ]);

  protected readonly projects = signal<Project[]>([
    {
      name: 'ClimBeast | fanatic community',
      repoUrl: 'https://github.com/endermejia/local-walls',
      siteUrl: 'https://climbeast.com',
      siteName: 'climbeast.com',
      tags: [
        { name: 'Angular 22', icon: 'https://cdn.simpleicons.org/angular' },
        { name: 'Taiga UI' },
        { name: 'Signal' },
        { name: 'Zoneless' },
        { name: 'SSR' },
        { name: 'I18n' },
        { name: 'Accessibility' },
        { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript' },
        { name: 'Tailwind', icon: 'https://cdn.simpleicons.org/tailwindcss' },
      ],
    },
    {
      name: 'Nhoa Noir | Fotografía',
      repoUrl: 'https://github.com/endermejia/astro-photographer',
      siteUrl: 'https://nhoanoir.com',
      siteName: 'nhoanoir.com',
      bgImage: 'https://nhoanoir.com/assets/images/og-image.jpg',
      tags: [
        { name: 'Astro', icon: 'https://cdn.simpleicons.org/astro' },
        { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript' },
      ],
    },
    {
      name: 'Gabriel Mejía | Portfolio Adventure',
      repoUrl: 'https://github.com/endermejia/pix',
      siteUrl: 'https://gabriel-mejia.vercel.app/',
      siteName: 'gabriel-mejia.vercel.app',
      tags: [
        { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs' },
        { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript' },
      ],
    },
    {
      name: 'Club Escalada Costa Blanca',
      repoUrl: 'https://github.com/endermejia/club-escalada-costa-blanca',
      siteUrl: 'https://clubescaladacostablanca.com/#/blog',
      siteName: 'clubescaladacostablanca.com',
      tags: [
        { name: 'Angular', icon: 'https://cdn.simpleicons.org/angular' },
        { name: 'Angular Material' },
      ],
    },
    {
      name: 'Reform Caravan',
      repoUrl: 'https://github.com/endermejia/reformcaravan',
      siteUrl: 'https://reformcaravan.vercel.app/',
      siteName: 'reformcaravan.vercel.app',
      tags: [
        { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs' },
        { name: 'React', icon: 'https://cdn.simpleicons.org/react' },
        { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss' },
        { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript' },
      ],
    },
    {
      name: 'Sergio Solbes',
      repoUrl: 'https://github.com/endermejia/sergio-solbes',
      siteUrl: 'https://sergio-solbes.vercel.app/',
      siteName: 'sergio-solbes.vercel.app',
      tags: [
        { name: 'Astro', icon: 'https://cdn.simpleicons.org/astro' },
        { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss' },
        { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript' },
      ],
    },
    {
      name: 'Gripco',
      repoUrl: 'https://github.com/endermejia/gripco',
      siteUrl: 'https://gripco.vercel.app/',
      siteName: 'gripco.vercel.app',
      tags: [
        { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs' },
        { name: 'React', icon: 'https://cdn.simpleicons.org/react' },
        { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss' },
        { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript' },
      ],
    },
  ]);

  protected readonly fccLogo = computed(() =>
    this.global.selectedTheme() === 'light'
      ? 'https://cdn.simpleicons.org/freecodecamp/black'
      : 'https://cdn.simpleicons.org/freecodecamp/white',
  );

  private readonly expandedExps = signal<Set<Experience>>(new Set());

  protected isExpanded(exp: Experience): boolean {
    return this.expandedExps().has(exp);
  }

  protected toggleExp(exp: Experience, event?: Event): void {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const next = new Set(this.expandedExps());
    if (next.has(exp)) { next.delete(exp); } else { next.add(exp); }
    this.expandedExps.set(next);
  }

  protected onExpKeydown(event: Event, exp: Experience): void {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
      event.preventDefault();
      this.toggleExp(exp);
    }
  }

  protected readonly langIndex = computed(() => this.global.selectedLanguage() === 'en' ? 0 : 1);

  protected onLangChange(index: number): void {
    const lang = index === 0 ? 'en' : 'es';
    if (this.global.selectedLanguage() !== lang) { this.global.switchLanguage(); }
  }

  protected readonly themeIndex = computed(() => this.global.selectedTheme() === 'light' ? 0 : 1);

  protected onThemeChange(index: number): void {
    const theme = index === 0 ? 'light' : 'dark';
    if (this.global.selectedTheme() !== theme) { this.global.switchTheme(); }
  }
}
