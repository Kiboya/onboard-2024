// src/app/header/header.component.ts

// Angular Core
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

// Angular CDK
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// Angular Router
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';

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
import { AuthService } from '../services/auth.service';


/**
 * Enum for the different navigation modes.
 */
enum NavMode {
  HIDDEN_RETRACTED,
  HIDDEN_EXPANDED,
  REDUCED_RETRACTED,
  REDUCED_EXPANDED,
  NORMAL_RETRACTED,
  NORMAL_EXPANDED,
}

/**
 * Interface for a navigation item in the sidenav.
 */
interface NavItem {
  routerLink?: string;
  icon: string;
  labelKey: string;
  expanded?: boolean;
  children?: NavItem[];
}

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
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatExpansionModule,
    HorizontalScrollDirective
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // ViewChild for the sidenav component.
  @ViewChild('sidenav') sidenav!: MatSidenav;

  // Subscriptions 
  private subscriptions = new Subscription();

  // Variables used to manage different elements of the header.
  isDarkTheme = false;
  currentLanguage = 'fr';
  isSidenavExpanded = true;
  backdrop = false;
  previousMouseEnter = false;
  isLoginPage = false;
  isPlanningPage = false;
  currentWeekStart!: Date;
  weekDays: Date[] = [];

  // Defines the navigation items for the sidenav.
  navItems: NavItem[] = [
    { icon: 'description', routerLink: '/reference-documents', labelKey: 'sidenav.reference-documents' },
    { icon: 'person', routerLink: '/informations', labelKey: 'sidenav.informations' },
    { icon: 'folder', routerLink: '/administrative-documents', labelKey: 'sidenav.administrative-documents' },
    { icon: 'school', routerLink: '/schooling', labelKey: 'sidenav.schooling' },
    { icon: 'event_busy', routerLink: '/absences', labelKey: 'sidenav.absences' },
    {
      icon: 'calendar_month',
      labelKey: 'sidenav.planning',
      expanded: false,
      children: [
        { icon: 'calendar_month', routerLink: '/planning', labelKey: 'sidenav.my-planning' },
        { icon: 'calendar_month', routerLink: '/planning', labelKey: 'sidenav.group-planning' },
        { icon: 'calendar_month', routerLink: '/planning', labelKey: 'sidenav.room-planning' }
      ]
    },
  ];

  // Defines the settings for each navigation mode.
  private navModeSettings = {
    [NavMode.HIDDEN_RETRACTED]: { isExpanded: false, backdrop: true, action: 'close' },
    [NavMode.HIDDEN_EXPANDED]: { isExpanded: true, backdrop: true, action: 'open' },
    [NavMode.REDUCED_RETRACTED]: { isExpanded: false, backdrop: false, action: 'open' },
    [NavMode.REDUCED_EXPANDED]: { isExpanded: true, backdrop: true, action: 'open' },
    [NavMode.NORMAL_RETRACTED]: { isExpanded: true, backdrop: false, action: 'open' },
    [NavMode.NORMAL_EXPANDED]: { isExpanded: true, backdrop: false, action: 'open' },
  };

  NavMode = NavMode;
  private _currentNavMode: NavMode = NavMode.NORMAL_EXPANDED;

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
   * Constructor for HeaderComponent.
   * @param {ThemeService} themeService - Service to switch the theme.
   * @param {LanguageService} languageService - Service to switch the language.
   * @param {TranslocoService} translocoService - Service to switch the language.
   * @param {BreakpointObserver} breakpointObserver - Service to observe the screen size.
   * @param {ChangeDetectorRef} cdr - Manually trigger a change detection for the sidenav.
   * @param {Router} router - Service to navigate between routes.
   * @param {PlanningService} planningService - Service to manage the planning data.
   * @param {AuthService} authService - Service to manage the authentication state.
   */
  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translocoService: TranslocoService,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private planningService: PlanningService,
    private authService: AuthService,
  ) {
    // Check if the route is the login page or the planning page
    const routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        this.isLoginPage = currentRoute.includes('/login');
        this.isPlanningPage = currentRoute.includes('/planning');

        // Reset navigation mode on route change
        this.initializeNavMode();
      }
    });
    this.subscriptions.add(routerSub);
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

    // Observes the screen size and sets the navigation mode accordingly.
    this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.XSmall]).subscribe(result => {
      if (this.breakpointObserver.isMatched(Breakpoints.XSmall)) {
        this.currentNavMode = NavMode.HIDDEN_RETRACTED;
      } else if (this.breakpointObserver.isMatched(Breakpoints.Medium) || this.breakpointObserver.isMatched(Breakpoints.Small)) {
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

    // Set the initial navigation mode when the component initializes
    this.initializeNavMode();
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
  * Toggles the expansion state of a nav item.
  * @param item The navigation item to toggle.
  */
  toggleExpansion(item: NavItem): void {
    if (this.isSidenavExpanded) {
      item.expanded = !item.expanded;
    }
  }

  /**
  * Logs out the user and navigates to the login page.
  */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Initializes the navigation mode based on the current screen size.
   */
  private initializeNavMode(): void {
    if (this.currentNavMode === NavMode.HIDDEN_EXPANDED) {
      this.currentNavMode = NavMode.HIDDEN_RETRACTED;
    } else if (this.currentNavMode === NavMode.REDUCED_EXPANDED) {
      this.currentNavMode = NavMode.REDUCED_RETRACTED;
    }
  }

  /**
   * Handles changes to the navigation mode by updating the sidenav state and triggering change detection.
   * @param {NavMode} newNavMode - The new navigation mode.
   */
  private onNavModeChange(newNavMode: NavMode): void {
    const settings = this.navModeSettings[newNavMode];
    if (!settings) {
      console.error('Unknown NavMode:', newNavMode);
      return;
    }

    this.isSidenavExpanded = settings.isExpanded;
    this.backdrop = settings.backdrop;

    if (this.sidenav) {
      settings.action === 'open' ? this.sidenav.open() : this.sidenav.close();
    }

    if (!this.isSidenavExpanded) {
      this.navItems.forEach(item => {
        if (item.children) {
          item.expanded = false;
        }
      });
    }

    this.cdr.detectChanges();
  }
}