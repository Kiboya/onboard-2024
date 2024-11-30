// src/app/header/header.component.ts

// Angular Core
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

// Third-Party Libraries
import { TranslocoModule, TranslocoService, getBrowserLang } from '@ngneat/transloco';

// RxJS Library
import { Subscription } from 'rxjs';

// Local Services and Components
import { ThemeService } from '../services/theme.service';
import { LanguageService } from '../services/language.service';
import { PlanningService } from '../services/planning.service';
import { LogoComponent } from '../logo/logo.component';
import { HorizontalScrollDirective } from '../directives/horizontal-scroll.directive';

/**
 * @fileoverview HeaderComponent is responsible for rendering the header section of the application.
 * It includes the navigation menu, theme toggling, and language switching functionalities.
 * The component also handles different navigation modes based on screen size and user interactions.
 */
@Component({
  selector: 'app-header',
  imports: [
    LogoComponent,
    RouterModule,
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    TranslocoModule,
    MatToolbarModule,
    HorizontalScrollDirective
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() isLoginPage: boolean = false;
  @Input() isPlanningPage: boolean = false;
  @Input() displaySidenavButton: boolean = false;

  @Output() headerButtonClicked = new EventEmitter<void>();

  // Subscriptions 
  private subscriptions = new Subscription();

  // Variables used to manage different elements of the header.
  isDarkTheme = false;
  currentLanguage = 'fr';
  currentWeekStart!: Date;
  weekDays: Date[] = [];

  /**
   * Constructor for HeaderComponent.
   * @param {ThemeService} themeService - Service to switch the theme.
   * @param {LanguageService} languageService - Service to switch the language.
   * @param {TranslocoService} translocoService - Service to switch the language.
   * @param {PlanningService} planningService - Service to manage the planning data.
   */
  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translocoService: TranslocoService,
    private planningService: PlanningService,
  ) {
  }

  /**
   * Initializes the component by observing the theme, screen size, and loading the language.
   */
  ngOnInit(): void {
    // Observes the theme and updates the isDarkTheme variable accordingly.
    const themeSub = this.themeService.isDarkTheme$.subscribe(isDarkTheme => {
      this.isDarkTheme = isDarkTheme;
    });
    this.subscriptions.add(themeSub);

    // Loads the language from local storage or browser settings
    const storedLang = localStorage.getItem('language');
    const browserLang = getBrowserLang() || 'fr';
    this.currentLanguage = storedLang || browserLang;
    this.languageService.switchLanguage(this.currentLanguage);

    const langSub = this.translocoService.langChanges$.subscribe(lang => {
      this.currentLanguage = lang;
    });
    this.subscriptions.add(langSub);

    const planningSub = this.planningService.currentWeekStart$.subscribe(date => {
      this.currentWeekStart = date;
      this.weekDays = Array.from({ length: 6 }, (_, i) => {
        const day = new Date(date);
        day.setDate(date.getDate() + i);
        return day;
      });
    });
    this.subscriptions.add(planningSub);
  }

  /**
   * Unsubscribes from all subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Navigates to the previous week.
   */
  previousWeek(): void {
    this.planningService.previousWeek();
  }

  /**
   * Navigates to the next week.
   */
  nextWeek(): void {
    this.planningService.nextWeek();
  }

  /**
   * Navigates to the current week.
   */
  goToToday(): void {
    this.planningService.goToToday();
  }

  /**
   * Toggles the theme between light and dark modes.
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Switches the application language.
   * @param {string} language - The new language to switch to.
   */
  switchLanguage(language: string): void {
    this.languageService.switchLanguage(language);
  }

  /**
   * Emits an event when the header button is clicked.
   */
  onHeaderButtonClick(): void {
    this.headerButtonClicked.emit();
  }
}