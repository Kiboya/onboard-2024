
// Angular Core
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
import { AuthService } from '../services/auth.service';

// RxJS
import { tap } from 'rxjs';

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
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit {
  /**
   * Indicates whether the dark theme is active.
   */
  isDarkTheme: boolean = false;

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.isDarkTheme$.subscribe((isDarkTheme: boolean) => {
      this.isDarkTheme = isDarkTheme;    
    });
  }
  public connexion(): void {
    if (this.loginForm.valid) {
      const { login, password } = this.loginForm.value;
      this.authService
        .login(login, password)
        .pipe(
          tap((res) => {
            this.authService.saveToken(res.token.access_token);
            this.router.navigate(['/login']).then(() => {
              window.location.reload();
            });
          })
        )
        .subscribe();
    }
  }
  public connexion(): void {
    if (this.loginForm.valid) {
      const { login, password } = this.loginForm.value;
      this.authService
        .login(login, password)
        .pipe(
          tap((res) => {
            this.authService.saveToken(res.token.access_token);
            this.router.navigate(['/login']).then(() => {
              window.location.reload();
            });
          })
        )
        .subscribe();
    }
  }
}