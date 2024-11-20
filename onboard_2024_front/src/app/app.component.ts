// app.component.ts
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';

/**
 * @fileoverview AppComponent is the root component of the application.
 * It is responsible for rendering the header and the main content of the application.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'onboard_2024_front';

  constructor() { }

}