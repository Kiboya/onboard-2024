import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * @fileoverview ThemeService is responsible for handling theme changes in the application.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // BehaviorSubject to keep track of the current theme
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
  // Observable for the current theme
  isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  /**
   * Constructor for ThemeService.
   */
  constructor() {
    this.initializeTheme();
  }

  /**
   * Toggles the theme between light and dark mode.
   */
  toggleTheme(): void {
    const isDarkTheme = !this.isDarkThemeSubject.value;
    this.updateTheme(isDarkTheme);
  }

  /**
   * Initializes the theme based on the user's preference.
   */
  private initializeTheme(): void {
    const themePreference = localStorage.getItem('theme') === 'dark';
    this.updateTheme(themePreference);
  }

  /**
   * Updates the theme based on the user's preference.
   * @param isDarkTheme - The user's theme preference.
   */
  private updateTheme(isDarkTheme: boolean): void {
    this.isDarkThemeSubject.next(isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    this.applyTheme(isDarkTheme);
  }

  /**
   * Applies the theme to the application.
   * @param isDarkTheme - Whether the theme is dark or not.
   */
  private applyTheme(isDarkTheme: boolean): void {
    const body = document.body;
    if (isDarkTheme) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
}