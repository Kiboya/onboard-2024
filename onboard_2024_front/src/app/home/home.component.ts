import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

interface ContentNode {
  type: 'text' | 'link' | 'list' | 'paragraph' | 'container';
  text?: string;
  url?: string;
  class?: string;
  children?: ContentNode[];
}

interface Title {
  text: string;
  class?: string;
}

interface Card {
  title: Title;
  content: ContentNode[];
  class?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    TranslocoModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] // Fixed 'styleUrls' typo
})
export class HomeComponent implements OnInit {
  cards: Card[] = [];

  constructor(private translocoService: TranslocoService) {}

  ngOnInit() {
    this.translocoService
      .selectTranslateObject<Card[]>('home.cards')
      .subscribe((cards) => {
        this.cards = cards;
        console.log(this.cards);
      });
  }

  
  // cards: Card[] = [
  //   {
  //     title: {
  //       text: 'home.card1.title',
  //       class: 'card1-title'
  //     },
  //     content: [
  //       {
  //         type: 'text',
  //         class: 'warning centered',
  //         text: 'home.card1.node1'
  //       },
  //       {
  //         type: 'text',
  //         class: 'centered card1-strong',
  //         text: 'home.card1.node2'
  //       },
  //       {
  //         type: 'text',
  //         class: 'centered',
  //         text: 'home.card1.node3'
  //       },
  //       {
  //         type: 'text',
  //         class: 'centered card1-strong',
  //         text: 'home.card1.node4'
  //       },
  //       {
  //         type: 'text',
  //         class: 'centered',
  //         text: 'home.card1.node5'
  //       },
  //       {
  //         type: 'text',
  //         class: 'centered card1-strong',
  //         text: 'home.card1.node6'
  //       },
  //       {
  //         type: 'text',
  //         class: 'centered',
  //         text: 'home.card1.node7'
  //       },
  //       {
  //         type: 'text',
  //         class: 'centered card1-strong',
  //         text: 'home.card1.node8'
  //       },
  //       {
  //         type: 'text',
  //         class: 'centered',
  //         text: 'home.card1.node9'
  //       }
  //     ],
  //     class: 'card1'
  //   },
  //   {
  //     title: {
  //       text: 'home.card2.title',
  //       class: 'card2-title'
  //     },
  //     content: [
  //       {
  //         type: 'paragraph',
  //         class: 'justified',
  //         children: [
  //           {
  //             type: 'text',
  //             text: 'home.card2.node1'
  //           }
  //         ],
  //       },
  //       {
  //         type: 'paragraph',
  //         class: 'justified',
  //         children: [
  //           {
  //             type: 'text',
  //             text: 'home.card2.node2'
  //           }
  //         ],
  //       },
  //       {
  //         type: 'paragraph',
  //         class: 'justified',
  //         children: [
  //           {
  //             type: 'text',
  //             text: 'home.card2.node3'
  //           }
  //         ],
  //       },
  //       {
  //         type: 'paragraph',
  //         class: 'justified',
  //         children: [
  //           {
  //             type: 'text',
  //             text: 'home.card2.node4'
  //           },
  //           {
  //             type: 'link',
  //             class: 'no-stretch',
  //             text: 'home.card2.node5',
  //             url: 'mailto:dpo@ec-nantes.fr'
  //           },
  //           {
  //             type: 'text',
  //             text: 'home.card2.node6'
  //           }
  //         ],
  //       },
  //     ],
  //     class: 'card2'
  //   },
  // ];
}