// src/dto/home-card.dto.ts

/**
 * @fileoverview DTO for generic card operations.
 */
export class HomeCardDto {
    title: string;
    title_en?: string;
    cssClass?: string;
    order?: number;
    contents: HomeCardContentDto[];
}

export class HomeCardContentDto {
    type: string;
    content?: string;
    content_en?: string;
    url?: string;
    cssClass?: string;
    order?: number;
    children?: HomeCardContentDto[];
}