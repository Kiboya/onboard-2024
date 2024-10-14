import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ThemeService } from './services/theme.service';
import { LoginComponent } from './login/login.component';
import { LogoComponent } from './logo/logo.component';
import { TranslocoModule, getBrowserLang } from '@ngneat/transloco';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    TranslocoModule,

    // Custom components
    LoginComponent,
    LogoComponent,

    // Material modules
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonToggleModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'onboard_2024_front';
  isDarkTheme = false;
  currentLanguage = 'fr';

  constructor(private themeService: ThemeService, private languageService: LanguageService) { }

  ngOnInit(): void {
    this.themeService.isDarkTheme$.subscribe(isDarkTheme => {
      this.isDarkTheme = isDarkTheme;
    });

    const storedLang = localStorage.getItem('language');
    const browserLang = getBrowserLang() || 'fr';
    this.currentLanguage = storedLang || browserLang;
    this.languageService.switchLanguage(this.currentLanguage);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  switchLanguage(language: string): void {
    this.languageService.switchLanguage(language);
  }
}