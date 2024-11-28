// src/app/login/login.component.ts

// Angular Core
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription, tap } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

/**
 * @fileoverview LoginComponent is responsible for rendering the login form.
 * The component allows for user authentication.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    LogoComponent,
    TranslocoModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

  // Subscriptions 
  private subscriptions = new Subscription();

  /**
   * Indicates whether the dark theme is active.
   */
  isDarkTheme: boolean = false;

  /**
   * Width of the logo.
   */
  logoWidth: string = '300px';

  /**
   * Form group for the login form.
   */
  public loginForm: FormGroup;

  /**
   * Constructor for LoginComponent.
   * @param {FormBuilder} fb - Service to build reactive forms.
   * @param {AuthService} authService - Service to manage authentication state.
   * @param {Router} router - Service to navigate between routes.
   * @param {ThemeService} themeService - Service to toggle application themes.
   * @param {BreakpointObserver} breakpointObserver - Service to observe screen size changes.
   */
  public constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private breakpointObserver: BreakpointObserver) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
 * Lifecycle hook that is called after data-bound properties are initialized.
 * Subscribes to the theme service to get the current theme.
 * @returns {void}
 */
  ngOnInit(): void {
    const themeSub = this.themeService.isDarkTheme$.subscribe((isDarkTheme: boolean) => {
      this.isDarkTheme = isDarkTheme;
    });
    this.subscriptions.add(themeSub);

    this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.XSmall]).subscribe(result => {
      if (this.breakpointObserver.isMatched(Breakpoints.XSmall)) {
        this.logoWidth = '75%';
      } else {
        this.logoWidth = '300px';
      }
    });
  }

  /**
   * Handles the form submission for user authentication.
   * If the form is valid, the user is authenticated and redirected to the home page.
   * @returns {void}
   */
  public connexion(): void {
    if (this.loginForm.valid) {
      const { login, password } = this.loginForm.value;
      this.authService
        .login(login, password)
        .pipe(
          tap((res) => {
            this.authService.saveToken(res.token.access_token);
            this.router.navigate(['/home']).then(() => {
              window.location.reload();
            });
          })
        )
        .subscribe();
    }
  }

  /**
  * Unsubscribes from all subscriptions when the component is destroyed.
  * @returns {void}
  */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}