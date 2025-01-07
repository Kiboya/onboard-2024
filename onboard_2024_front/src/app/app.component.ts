// src/app/app.component.ts

// Angular Core
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

// Angular CDK
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// Angular Router
import { NavigationEnd, Router, RouterModule } from '@angular/router';

// Third-Party Libraries
import { TranslocoModule } from '@ngneat/transloco';

// RxJS Library
import { Subscription } from 'rxjs';

// Local Services and Components
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './header/header.component';

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
 * @fileoverview AppComponent is the root component of the application.
 * It is responsible for rendering the header and the main content of the application.
 */
@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    CommonModule,
    HeaderComponent,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    TranslocoModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'onboard_2024_front';
  // ViewChild for the sidenav component.
  @ViewChild('sidenav') sidenav!: MatSidenav;

  /**
   * Listens for window resize events to update the navigation mode.
   * @param {Event} event - The window resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateNavMode();
  }

  // Subscriptions 
  private subscriptions = new Subscription();

  // Variables used to manage different elements of the header.
  isSidenavExpanded = true;
  backdrop = false;
  previousMouseEnter = false;
  isLoginPage = false;
  isPlanningPage = false;
  mouseLeftSidenav = false;

  // Defines the navigation items for the sidenav.
  navItems: NavItem[] = [
    // { icon: 'description', routerLink: '/reference-documents', labelKey: 'sidenav.reference-documents' }, // Not implemented yet
    // { icon: 'person', routerLink: '/informations', labelKey: 'sidenav.informations' }, // Not implemented yet
    // { icon: 'folder', routerLink: '/administrative-documents', labelKey: 'sidenav.administrative-documents' }, // Not implemented yet
    // { icon: 'school', routerLink: '/schooling', labelKey: 'sidenav.schooling' }, // Not implemented yet
    {
      icon: 'event_busy',
      labelKey: 'sidenav.absences.label',
      expanded: false,
      children: [
        { icon: 'add', routerLink: '/absences/submit', labelKey: 'sidenav.absences.submit', },
        { icon: 'list', routerLink: '/absences/list', labelKey: 'sidenav.absences.list', },
      ],
    },
    {
      icon: 'calendar_month',
      labelKey: 'sidenav.planning.label',
      expanded: false,
      children: [
        { icon: 'calendar_month', routerLink: '/planning', labelKey: 'sidenav.planning.my-planning' },
        { icon: 'calendar_month', routerLink: '/group-planning', labelKey: 'sidenav.planning.group-planning' },
        { icon: 'calendar_month', routerLink: '/room-planning', labelKey: 'sidenav.planning.room-planning' }
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
   * @param {BreakpointObserver} breakpointObserver - Service to observe the screen size.
   * @param {ChangeDetectorRef} cdr - Manually trigger a change detection for the sidenav.
   * @param {Router} router - Service to navigate between routes.
   * @param {AuthService} authService - Service to manage the authentication state.
   */
  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private router: Router,
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
    // Set the initial navigation mode when the component initializes
    this.initializeNavMode();
    this.updateNavMode();
  }

  /**
   * Unsubscribes from all subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Toggles the sidenav between expanded and retracted states.
   */
  toggleSidenav(): void {
    if (this.mouseLeftSidenav) {
      return;
    }
    if (this.currentNavMode === NavMode.HIDDEN_RETRACTED) {
      this.currentNavMode = NavMode.HIDDEN_EXPANDED;
    } else if (this.currentNavMode === NavMode.HIDDEN_EXPANDED) {
      this.currentNavMode = NavMode.HIDDEN_RETRACTED;
    } else if (this.currentNavMode === NavMode.REDUCED_RETRACTED) {
      this.currentNavMode = NavMode.REDUCED_EXPANDED;
      console.log('Toggled to REDUCED_EXPANDED');
    } else if (this.currentNavMode === NavMode.REDUCED_EXPANDED) {
      this.currentNavMode = NavMode.REDUCED_RETRACTED;
      console.log('Toggled to REDUCED_RETRACTED');
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
   * Retracts the sidenav when the mouse leaves if the current mode is REDUCED_EXPANDED and starts a timeout to prevent toggling.
   */
  onSidenavMouseLeave(): void {
    if (this.currentNavMode === NavMode.REDUCED_EXPANDED && this.previousMouseEnter) {
      this.previousMouseEnter = false;
      this.currentNavMode = NavMode.REDUCED_RETRACTED;
      this.mouseLeftSidenav = true;
      setTimeout(() => {
        this.mouseLeftSidenav = false;
      }, 300);
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

  /**
   * Updates the navigation mode based on the current screen size.
   */
  private updateNavMode(): void {
    if (this.breakpointObserver.isMatched(Breakpoints.XSmall)) {
      this.currentNavMode = NavMode.HIDDEN_RETRACTED;
    } else if (this.breakpointObserver.isMatched(Breakpoints.Medium) || this.breakpointObserver.isMatched(Breakpoints.Small)) {
      this.currentNavMode = NavMode.REDUCED_RETRACTED;
    } else {
      this.currentNavMode = NavMode.NORMAL_EXPANDED;
    }
  }
}