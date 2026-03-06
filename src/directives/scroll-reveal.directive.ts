import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
  PLATFORM_ID,
  NgZone,
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
  private zone = inject(NgZone);

  private unlistenScroll: (() => void) | null = null;
  private unlistenResize: (() => void) | null = null;
  private animationFrameId: number | null = null;
  private scrollHandler = this.scheduleUpdate.bind(this);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        // Initial setup for the element
        this.renderer.setStyle(this.element.nativeElement, 'will-change', 'opacity, transform');
        this.renderer.setStyle(this.element.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.element.nativeElement, 'transform', 'translateY(50px)');

        // Run the update loop on scroll and resize, capturing events in the capture phase
        // since the scrolling might happen in a specific container rather than window.
        this.unlistenScroll = this.renderer.listen('window', 'scroll', this.scrollHandler);

        // Sometimes the scroll event is on document or a specific overflow element,
        // using capture helps catch it.
        if (typeof document !== 'undefined') {
            document.addEventListener('scroll', this.scrollHandler, true);
        }

        this.unlistenResize = this.renderer.listen('window', 'resize', this.scrollHandler);

        // Initial check
        this.scheduleUpdate();
      });
    }
  }

  private scheduleUpdate(): void {
    if (this.animationFrameId === null) {
      this.animationFrameId = requestAnimationFrame(() => {
        this.updateElementState();
        this.animationFrameId = null;
      });
    }
  }

  private updateElementState(): void {
    const el = this.element.nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Define the range in the viewport where the animation should occur.
    // E.g., start revealing when the top of the element hits the bottom 10% of the screen
    // and finish revealing when it's 20% further up.

    // We want to map the element's position relative to the viewport height
    // to a value between 0 (hidden) and 1 (fully visible).

    // Calculate how much of the element is inside the "reveal zone"
    const triggerStart = windowHeight * 0.95; // Animation starts when top hits this line
    const triggerEnd = windowHeight * 0.75;   // Animation finishes when top hits this line

    // The top position of the element relative to the viewport
    const elementTop = rect.top;

    let progress = 0;

    if (elementTop > triggerStart) {
        // Element is below the start line
        progress = 0;
    } else if (elementTop < triggerEnd) {
        // Element is above the end line
        progress = 1;
    } else {
        // Element is in between, interpolate
        const range = triggerStart - triggerEnd;
        const currentPos = triggerStart - elementTop;
        progress = currentPos / range;
    }

    // Apply the mapped progress to opacity and transform
    const opacity = progress;
    const translateY = 50 * (1 - progress); // Moves from 50px down to 0px

    this.renderer.setStyle(el, 'opacity', opacity.toString());
    this.renderer.setStyle(el, 'transform', `translateY(${translateY}px)`);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
        if (this.unlistenScroll) {
          this.unlistenScroll();
        }
        if (this.unlistenResize) {
          this.unlistenResize();
        }
        if (typeof document !== 'undefined') {
            document.removeEventListener('scroll', this.scrollHandler, true);
        }
        if (this.animationFrameId !== null) {
          cancelAnimationFrame(this.animationFrameId);
        }
    }
  }
}
