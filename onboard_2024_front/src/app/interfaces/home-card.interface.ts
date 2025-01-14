// src/app/interfaces/home-card.interface.ts

/**
 * @fileoverview Defines interfaces for home page cards and their content.
 */

/**
 * Represents the content of a card.
 */
export interface CardContent {
    id: number;
    type: string;
    content?: string;
    url?: string;
    cssClass?: string;
    order: number;
    children?: CardContent[];
}

/**
 * Represents a card displayed on the home page.
 */
export interface Card {
    id: number;
    title: string;
    cssClass?: string;
    order: number;
    contents: CardContent[];
}