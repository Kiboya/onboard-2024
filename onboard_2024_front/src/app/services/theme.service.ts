import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  toggleTheme(): void {
    const isDarkTheme = !this.isDarkThemeSubject.value;
    this.updateTheme(isDarkTheme);
  }

  private initializeTheme(): void {
    const themePreference = localStorage.getItem('theme') === 'dark';
    this.updateTheme(themePreference);
  }

  private updateTheme(isDarkTheme: boolean): void {
    this.isDarkThemeSubject.next(isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    this.applyTheme(isDarkTheme);
  }

  private applyTheme(isDarkTheme: boolean): void {
    const body = document.body;
    if (isDarkTheme) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
}