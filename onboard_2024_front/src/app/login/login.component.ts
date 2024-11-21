
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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';


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

  public loginForm: FormGroup;
    /**
   * Constructor for LoginComponent.
   * 
   * @param themeService - Service for handling theme changes.
   */
  public constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService)
  {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  
    /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Subscribes to the theme service to get the current theme.
   */
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
}