// src/app/app.component.ts

// Angular Core
import { Component } from '@angular/core';
// Components
import { HeaderComponent } from './header/header.component';

/**
 * @fileoverview AppComponent is the root component of the application.
 * It is responsible for rendering the header and the main content of the application.
 */
@Component({
    selector: 'app-root',
    imports: [
        HeaderComponent,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'onboard_2024_front';

  /**
   * Constructor for AppComponent.
   */
  constructor() { }

}