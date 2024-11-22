import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { LogoComponent } from '../logo/logo.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';


@Component({
    selector: 'app-login',
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
  isDarkTheme: boolean = false;

  public loginForm: FormGroup;
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