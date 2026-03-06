import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private element = inject(ElementRef);
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.addClass(this.element.nativeElement, 'reveal-hidden');

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.removeClass(this.element.nativeElement, 'reveal-hidden');
            this.renderer.addClass(this.element.nativeElement, 'reveal-visible');
          } else {
            this.renderer.removeClass(this.element.nativeElement, 'reveal-visible');
            this.renderer.addClass(this.element.nativeElement, 'reveal-hidden');
          }
        });
      }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
      });

      this.observer.observe(this.element.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
