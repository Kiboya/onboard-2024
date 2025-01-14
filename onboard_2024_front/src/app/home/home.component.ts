// src/app/home/home.component.ts

// Angular Core
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';

// Interfaces
import { Card } from '../interfaces/home-card.interface';

// Services
import { HomeService } from '../services/home.service';

// Transloco
import { TranslocoService } from '@ngneat/transloco';

/**
 * @fileoverview HomeComponent is responsible for displaying the home page with various cards.
 * It fetches the cards from the HomeService and displays them in a sorted order.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * Array of Card objects to be displayed on the home page.
   */
  cards: Card[] = [];

  /**
   * Current language of the application.
   */
  currentLanguage: string = 'en';

  private subscriptions = new Subscription();

  /**
   * Constructor for HomeComponent.
   * 
   * @param homeService - Service for fetching home page cards.
   * @param translocoService - Service for handling translations.
   */
  constructor(
    private homeService: HomeService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    // Initial load of cards
    this.loadCards();

    // Subscribe to language changes and reload cards accordingly
    const langSub = this.translocoService.langChanges$.subscribe(lang => {
      this.currentLanguage = lang;
      this.loadCards();
    });
    this.subscriptions.add(langSub);
  }

  /**
   * Loads cards from the HomeService and sorts them.
   */
  private loadCards(): void {
    const cardsSub = this.homeService.getCards().subscribe({
      next: (cards) => {
        this.cards = cards.sort((a, b) => a.order - b.order);
      },
      error: (err) => {
        console.error('Error fetching home cards', err);
      }
    });
    this.subscriptions.add(cardsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}