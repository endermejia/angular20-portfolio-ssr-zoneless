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
  selector: '[appMarqueeOnOverflow]',
})
export class MarqueeOnOverflowDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private resizeObserver: ResizeObserver | null = null;
  private cloned = false;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const host = this.el.nativeElement as HTMLElement;
      const span = host.querySelector('span');
      if (!span) return;

      this.checkOverflow(span, host);

      this.resizeObserver = new ResizeObserver(() => this.checkOverflow(span, host));
      this.resizeObserver.observe(host);
    });
  }

  private checkOverflow(span: HTMLElement, host: HTMLElement): void {
    const track = host.querySelector('.marquee-track');
    if (track) {
      track.remove();
      this.cloned = false;
    }

    const isOverflowing = span.scrollWidth > host.clientWidth;

    if (isOverflowing) {
      const trackDiv = document.createElement('div');
      trackDiv.className = 'marquee-track';

      const clone1 = span.cloneNode(true) as HTMLElement;
      clone1.setAttribute('aria-hidden', 'true');
      const clone2 = span.cloneNode(true) as HTMLElement;
      clone2.setAttribute('aria-hidden', 'true');

      trackDiv.appendChild(clone1);
      trackDiv.appendChild(clone2);
      host.appendChild(trackDiv);
      this.cloned = true;
    }

    host.classList.toggle('marquee-active', isOverflowing);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
