// src/home/home.service.ts

// Modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// TypeORM
import { Repository } from 'typeorm';

// Entities
import { Card } from './home-card.entity';
import { CardContent } from './home-card-content.entity';

// DTOs
import { HomeCardDto, HomeCardContentDto } from '../dto/home-card.dto';

/**
 * @fileoverview Provides services for managing home cards and their contents.
 */
@Injectable()
export class HomeService {
    constructor(
        @InjectRepository(Card)
        private cardRepository: Repository<Card>,
        @InjectRepository(CardContent)
        private cardContentRepository: Repository<CardContent>,
    ) { }

    /**
     * Retrieves all cards with their contents ordered.
     *
     * @returns An array of Card entities with their ordered contents.
     */
    async findAll(): Promise<Card[]> {
        const cards = await this.cardRepository.find({
            relations: ['contents', 'contents.children'],
        });

        // Sort contents and their children by 'order'
        cards.forEach(card => {
            card.contents = card.contents.filter(content => !content.parentId);
            card.contents.sort((a, b) => a.order - b.order);
            card.contents.forEach(content => {
                if (content.children) {
                    content.children.sort((a, b) => a.order - b.order);
                }
            });
        });
        return cards;
    }

    /**
     * Retrieves all cards and maps them based on the provided language.
     *
     * @param lang - The language code ('en' or 'fr').
     * @returns An array of mapped Card objects.
     */
    async getAllCards(lang: 'en' | 'fr'): Promise<any[]> {
        const cards = await this.findAll();
        return cards.map(card => ({
            ...card,
            title: lang === 'en' ? card.title_en : card.title,
            contents: card.contents.map(content => ({
                ...content,
                content: lang === 'en' ? content.content_en || content.content : content.content,
                children: content.children ? content.children.map(child => ({
                    ...child,
                    content: lang === 'en' ? child.content_en || child.content : child.content,
                })) : [],
            }))
        }));
    }

    /**
     * Retrieves a specific card by its ID.
     *
     * @param id - The ID of the card to retrieve.
     * @returns The Card entity with its contents.
     * @throws {NotFoundException} If the card is not found.
     */
    async findById(id: number): Promise<Card> {
        const card = await this.cardRepository.findOne({
            where: { id },
            relations: ['contents', 'contents.children']
        });

        if (!card) {
            throw new NotFoundException(`Card with ID ${id} not found`);
        }

        return card;
    }

    /**
     * Creates a new card with its contents.
     *
     * @param cardDto - The DTO containing card information.
     * @returns The newly created Card entity.
     */
    async createCard(cardDto: HomeCardDto): Promise<Card> {
        const card = this.cardRepository.create({
            title: cardDto.title,
            title_en: cardDto.title_en,
            cssClass: cardDto.cssClass,
            order: cardDto.order
        });

        const savedCard = await this.cardRepository.save(card);

        if (cardDto.contents) {
            const contents = cardDto.contents.map(contentDto =>
                this.createCardContent(contentDto, savedCard)
            );
            savedCard.contents = await Promise.all(contents);
        }

        return savedCard;
    }

    /**
     * Updates an existing card.
     *
     * @param id - The ID of the card to update.
     * @param cardDto - The DTO containing updated card information.
     * @returns The updated Card entity.
     * @throws {NotFoundException} If the card is not found.
     */
    async updateCard(id: number, cardDto: HomeCardDto): Promise<Card> {
        const card = await this.findById(id);

        // Update card properties
        Object.assign(card, {
            title: cardDto.title,
            title_en: cardDto.title_en,
            cssClass: cardDto.cssClass,
            order: cardDto.order
        });

        // Delete existing contents
        await this.cardContentRepository.delete({ card: { id } });

        // Create new contents
        if (cardDto.contents) {
            const contents = cardDto.contents.map(contentDto =>
                this.createCardContent(contentDto, card)
            );
            card.contents = await Promise.all(contents);
        }

        return this.cardRepository.save(card);
    }

    /**
     * Deletes a card and its contents.
     *
     * @param id - The ID of the card to delete.
     * @returns True if the deletion was successful.
     * @throws {NotFoundException} If the card is not found.
     */
    async deleteCard(id: number): Promise<boolean> {
        const card = await this.findById(id);
        await this.cardRepository.remove(card);
        return true;
    }

    /**
     * Helper method to create card content entities.
     *
     * @param contentDto - The DTO containing content information.
     * @param card - The parent Card entity.
     * @returns The created CardContent entity.
     */
    private async createCardContent(
        contentDto: HomeCardContentDto,
        card: Card,
        parent?: CardContent
    ): Promise<CardContent> {
        const content = this.cardContentRepository.create({
            type: contentDto.type,
            content: contentDto.content,
            url: contentDto.url,
            cssClass: contentDto.cssClass,
            order: contentDto.order,
            card: card,
            parent: parent || null,
            parentId: parent ? parent.id : null
        });

        const savedContent = await this.cardContentRepository.save(content);

        if (contentDto.children) {
            const children = contentDto.children.map(childDto =>
                this.createCardContent(childDto, card, savedContent)
            );
            savedContent.children = await Promise.all(children);
        }

        return savedContent;
    }
}