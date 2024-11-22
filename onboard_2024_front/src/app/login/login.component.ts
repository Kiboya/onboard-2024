
// Angular Core
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Third-Party Libraries
import { TranslocoModule } from '@ngneat/transloco';

// Local Services and Components
import { ThemeService } from '../services/theme.service';
import { LogoComponent } from '../logo/logo.component';

/**
 * @fileoverview
 * LoginComponent is responsible for rendering the login page of the application.
 * It includes a form for the user to input their credentials and log in.
 */
@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        LogoComponent,
        TranslocoModule,
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /**
   * Indicates whether the dark theme is active.
   */
  isDarkTheme: boolean = false;

  /**
   * Constructor for LoginComponent.
   * 
   * @param themeService - Service for handling theme changes.
   */
  constructor(private themeService: ThemeService) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Subscribes to the theme service to get the current theme.
   */
  ngOnInit(): void {
    this.themeService.isDarkTheme$.subscribe((isDarkTheme: boolean) => {
      this.isDarkTheme = isDarkTheme;
    });
  }
}