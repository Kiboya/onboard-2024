// Angular Core
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

// Models and Services
import { UserInfo } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

// Third-Party Libraries
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';


/**
 * @fileoverview
 * ProfileComponent is responsible for displaying user profile information.
 * It handles user data fetching and language changes for internationalization.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    TranslocoModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  userInfo!: UserInfo;
  currentLanguage: string = 'fr';
  private subscriptions = new Subscription();

  /**
   * Constructor for ProfileComponent.
   * 
   * @param userService - Service for handling user data operations
   * @param translocoService - Service for handling translations
   */
  constructor(
    private userService: UserService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    const langSub = this.translocoService.langChanges$.subscribe(lang => {
      this.currentLanguage = lang;
      this.loadUser();
    });
    this.subscriptions.add(langSub);
  }

  /**
   * Fetches user information from the backend API.
   */
  private loadUser(): void {
    const userSub = this.userService.getUserInfo().subscribe({
      next: (data) => this.userInfo = data,
      error: () => console.error('Error fetching user information'),
    });
    this.subscriptions.add(userSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}