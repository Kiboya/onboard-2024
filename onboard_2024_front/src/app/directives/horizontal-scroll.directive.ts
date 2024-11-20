import { Directive, HostListener, ElementRef } from '@angular/core';


/**
 * @fileoverview The HorizontalScrollDirective is responsible for enabling horizontal scrolling on an element when the user scrolls vertically.
 */
@Directive({
  selector: '[appHorizontalScroll]',
  standalone: true
})
export class HorizontalScrollDirective {
  constructor(private el: ElementRef) {}

  /**
   * Listens for the wheel event on the element and scrolls it horizontally.
   * 
   * @param event - The wheel event.
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