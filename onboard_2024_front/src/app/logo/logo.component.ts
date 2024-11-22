// Angular Core
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

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
   * Size of the logo.
   */
  @Input() size: 'small' | 'medium' | 'large' = 'medium'; 
}
