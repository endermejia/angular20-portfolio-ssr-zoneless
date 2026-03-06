import {
  Directive,
  ElementRef,
  inject,
  PLATFORM_ID,
  afterNextRender,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appReveal]',
})
export class ScrollRevealDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.el.nativeElement.classList.add('reveal-visible');
              this.observer?.unobserve(this.el.nativeElement);
            }
          });
        },
        {
          threshold: 0.01,
          rootMargin: '0px 0px 50px 0px',
        },
      );

      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
