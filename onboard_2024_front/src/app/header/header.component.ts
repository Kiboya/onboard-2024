import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../services/theme.service';
import { LanguageService } from '../services/language.service';
import { TranslocoModule, getBrowserLang } from '@ngneat/transloco';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    TranslocoModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
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