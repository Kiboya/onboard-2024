
// Angular Core
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';

// Third-Party Libraries
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

/**
 * Interface for a content node to be displayed on a card.
 */
interface ContentNode {
  type: 'text' | 'link' | 'list' | 'paragraph' | 'container';
  text?: string;
  url?: string;
  class?: string;
  children?: ContentNode[];
}

/**
 * Interface for a title to be displayed on a card.
 */
interface Title {
  text: string;
  class?: string;
}

/**
 * Interface for a card to be displayed on the home page.
 */
interface Card {
  title: Title;
  content: ContentNode[];
  class?: string;
}

/**
 * @fileoverview
 * HomeComponent is responsible for rendering the home page of the application.
 * It displays a collection of cards with different content nodes such as text, links, and lists.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TranslocoModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  /**
   * Array of cards to be displayed on the home page.
   */
  cards: Card[] = [];

  /**
   * Constructor for HomeComponent.
   * 
   * @param translocoService - Service for handling translations.
   */
  constructor(private translocoService: TranslocoService) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Fetches the cards from the translation service and assigns them to the `cards` array.
   */
  ngOnInit(): void {
    this.translocoService
      .selectTranslateObject<Card[]>('home.cards')
      .subscribe((cards) => {
        this.cards = cards;
      });
  }
}