// header.component.ts
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../services/theme.service';
import { LanguageService } from '../services/language.service';
import { TranslocoModule, getBrowserLang } from '@ngneat/transloco';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LogoComponent } from '../logo/logo.component';

enum NavMode {
  HIDDEN_RETRACTED,
  HIDDEN_EXPANDED,
  REDUCED_RETRACTED,
  REDUCED_EXPANDED,
  NORMAL_RETRACTED,
  NORMAL_EXPANDED,
}

interface NavItem {
  routerLink: string;
  icon: string;
  labelKey: string;
}

/**
 * @fileoverview HeaderComponent is responsible for rendering the header section of the application.
 * It includes the navigation menu, theme toggling, and language switching functionalities.
 * The component also handles different navigation modes based on screen size and user interactions.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LogoComponent,
    RouterModule,
    CommonModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isDarkTheme = false;
  currentLanguage = 'fr';
  isSidenavExpanded = true;
  backdrop = false;
  previousMouseEnter = false;
  isLoginPage = false; 


  // Defines the navigation items for the sidenav.
  navItems: NavItem[] = [
    { routerLink: '/reference-documents', icon: 'description', labelKey: 'sidenav.reference-documents' },
    { routerLink: '/informations', icon: 'person', labelKey: 'sidenav.informations' },
    { routerLink: '/administrative-documents', icon: 'folder', labelKey: 'sidenav.administrative-documents' },
    { routerLink: '/schooling', icon: 'school', labelKey: 'sidenav.schooling' },
    { routerLink: '/absences', icon: 'event_busy', labelKey: 'sidenav.absences' },
    { routerLink: '/planning', icon: 'calendar_month', labelKey: 'sidenav.planning' }
  ];

  NavMode = NavMode;
  private _currentNavMode: NavMode = NavMode.NORMAL_EXPANDED;

  // Defines the settings for each navigation mode.
  private navModeSettings = {
    [NavMode.HIDDEN_RETRACTED]: { isExpanded: false, backdrop: true, action: 'close' },
    [NavMode.HIDDEN_EXPANDED]: { isExpanded: true, backdrop: true, action: 'open' },
    [NavMode.REDUCED_RETRACTED]: { isExpanded: false, backdrop: false, action: 'open' },
    [NavMode.REDUCED_EXPANDED]: { isExpanded: true, backdrop: true, action: 'open' },
    [NavMode.NORMAL_RETRACTED]: { isExpanded: true, backdrop: true, action: 'open' },
    [NavMode.NORMAL_EXPANDED]: { isExpanded: true, backdrop: false, action: 'open' },
  };

  /**
   * Constructor for HeaderComponent.
   * @param {ThemeService} themeService - Service to switch the theme.
   * @param {LanguageService} languageService - Service to switch the language.
   * @param {BreakpointObserver} breakpointObserver - Service to observe the screen size.
   * @param {ChangeDetectorRef} cdr - Manually trigger a change detection for the sidenav.
   * @param {Router} router - Service to navigate between routes.
   * @param {ActivatedRoute} activatedRoute - Get the current route.
   */
  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  /**
 * Gets the current navigation mode.
 * @returns {NavMode} The current navigation mode.
 */
  get currentNavMode(): NavMode {
    return this._currentNavMode;
  }

  /**
   * Sets the current navigation mode and triggers the onNavModeChange method.
   * @param {NavMode} value - The new navigation mode.
   */
  set currentNavMode(value: NavMode) {
    if (this._currentNavMode !== value) {
      this._currentNavMode = value;
      this.onNavModeChange(value);
    }
  }

  /**
   * Gets the margin class for the mat-sidenav-content based on the current navigation mode.
   * @returns {string} The margin class.
   */
  get matSideNavContentMargin(): string {
    if (this.currentNavMode === NavMode.NORMAL_EXPANDED) {
      return 'full-margin';
    } else if (this.currentNavMode === NavMode.HIDDEN_RETRACTED || this.currentNavMode === NavMode.HIDDEN_EXPANDED) {
      return 'no-margin';
    }
    return '';
  }

  /**
   * Initializes the component by observing the theme, screen size, and loading the language.
   */
  ngOnInit(): void {
    // Observes the theme and updates the isDarkTheme variable accordingly.
    this.themeService.isDarkTheme$.subscribe(isDarkTheme => {
      this.isDarkTheme = isDarkTheme;
    });

    // Observes the screen size and sets the navigation mode accordingly.
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      if (this.breakpointObserver.isMatched(Breakpoints.XSmall)) {
        this.currentNavMode = NavMode.HIDDEN_RETRACTED;
      } else if (this.breakpointObserver.isMatched(Breakpoints.Small)) {
        this.currentNavMode = NavMode.REDUCED_RETRACTED;
      } else {
        this.currentNavMode = NavMode.NORMAL_EXPANDED;
      }
    });

    // Loads the language from local storage or browser settings
    const storedLang = localStorage.getItem('language');
    const browserLang = getBrowserLang() || 'fr';
    this.currentLanguage = storedLang || browserLang;
    this.languageService.switchLanguage(this.currentLanguage);

    // Check if the route is the login page
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.isLoginPage = currentRoute.includes('/login');
    });
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
   * Toggles the sidenav between expanded and retracted states.
   */
  toggleSidenav(): void {
    if (this.isSidenavExpanded) {
      this.currentNavMode--;
    } else {
      this.currentNavMode++;
    }
  }

  /**
   * Expands the sidenav when the mouse enters if the current mode is REDUCED_RETRACTED.
   */
  onSidenavMouseEnter(): void {
    if (this.currentNavMode === NavMode.REDUCED_RETRACTED) {
      this.previousMouseEnter = true;
      this.currentNavMode = NavMode.REDUCED_EXPANDED;
    }
  }

  /**
   * Retracts the sidenav when the mouse leaves if the current mode is REDUCED_EXPANDED and it was expanded by mouse enter.
   */
  onSidenavMouseLeave(): void {
    if (this.currentNavMode === NavMode.REDUCED_EXPANDED && this.previousMouseEnter) {
      this.previousMouseEnter = false;
      this.currentNavMode = NavMode.REDUCED_RETRACTED;
    }
  }

  /**
   * Handles changes to the navigation mode by updating the sidenav state and triggering change detection.
   * @param {NavMode} newNavMode - The new navigation mode.
   */
  private onNavModeChange(newNavMode: NavMode = this._currentNavMode): void {
    const settings = this.navModeSettings[newNavMode];
    if (settings) {
      this.isSidenavExpanded = settings.isExpanded;
      this.backdrop = settings.backdrop;
      if (this.sidenav) {
        const action = settings.action as 'open' | 'close';
        this.sidenav[action]();
      }
      this.cdr.detectChanges();
    } else {
      console.error('Unknown NavMode:', newNavMode);
    }
  }
}