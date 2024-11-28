// src/app/directives/horizontal-scroll.directive.ts

// Angular Core
import { Directive, HostListener, ElementRef } from '@angular/core';

/**
 * @fileoverview The HorizontalScrollDirective is responsible for enabling horizontal scrolling on an element when the user scrolls vertically.
 */
@Directive({
  selector: '[appHorizontalScroll]',
  standalone: true
})
export class HorizontalScrollDirective {
  /**
   * Constructor for HorizontalScrollDirective.
   * @param {ElementRef} el - The element reference.
   */
  constructor(private el: ElementRef) {}

  /**
   * Listens for the wheel event on the element and scrolls it horizontally.
   * 
   * @param {WheelEvent} event - The wheel event.
   */
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    // Only execute when scrolling vertically
    if (event.deltaY === 0) {
      return;
    }
    event.preventDefault();
    // Scroll the element horizontally
    this.el.nativeElement.scrollLeft += event.deltaY;
  }
}