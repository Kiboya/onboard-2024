// src/home/home-card.entity.ts

// Modules
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

// Entities
import { CardContent } from './home-card-content.entity';

/**
 * @fileoverview Defines the Card entity with generic properties and relationships.
 */
@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  title_en: string;

  @Column({ nullable: true })
  cssClass: string;

  @Column({ default: 0 })
  order: number;

  @OneToMany(() => CardContent, content => content.card, { eager: true, cascade: true })
  contents: CardContent[];
}