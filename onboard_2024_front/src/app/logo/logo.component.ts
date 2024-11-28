// src/app/logo/logo.component.ts

// Angular Core
import { CommonModule } from '@angular/common';
import { Component, Input, HostBinding } from '@angular/core';

// Angular Material Modules
import { MatIconModule } from '@angular/material/icon';

/**
 * @fileoverview LogoComponent is responsible for rendering the application logo.
 * The component allows for customization of the logo size and theme.
 */
@Component({
    selector: 'app-logo',
    imports: [
        MatIconModule,
        CommonModule
    ],
    templateUrl: './logo.component.html',
    styleUrl: './logo.component.scss'
})
export class LogoComponent {
  /**
   * Flag indicating whether the dark theme should be applied to the logo.
   */
  @Input() isDarkTheme: boolean = false; 

  /**
   * Width and height of the logo.
   */
  @Input() width: string = 'auto';
  @Input() height: string = 'auto';

  /**
   * Size of the logo.
   */
  @Input() size: 'small' | 'medium' | 'large' = 'medium'; 

  /**
   * Host binding for the theme of the logo.
   * @returns {string} The theme of the logo.
   */
  @HostBinding('style.width') get hostWidth(): string {
    return this.width;
  }

  /**
   * Host binding for the height of the logo.
   * @returns {string} The height of the logo.
   */
  @HostBinding('style.height') get hostHeight(): string {
    return this.height;
  }
}
