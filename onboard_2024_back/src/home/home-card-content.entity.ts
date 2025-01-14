// src/home/home-card-content.entity.ts

// Modules
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

// Entities
import { Card } from './home-card.entity';

/**
 * @fileoverview Defines the CardContent entity for a flexible nested structure.
 */
@Entity('card_contents')
export class CardContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  content_en: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  cssClass: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Card, card => card.contents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cardId' })
  card: Card;

  @ManyToOne(() => CardContent, content => content.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent: CardContent;

  @Column({ nullable: true })
  parentId: number;

  @OneToMany(() => CardContent, content => content.parent, { cascade: true })
  children: CardContent[];
}