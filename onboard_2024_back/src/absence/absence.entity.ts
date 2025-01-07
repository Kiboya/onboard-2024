// src/absence/absence.entity.ts

// Modules
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

// Entities
import { User } from '../user/user.entity';

/**
 * @fileoverview Defines the Absence entity with its properties and relationships to other entities.
 */
@Entity('absences')
export class Absence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  reason: string;

  @Column({ nullable: true })
  additionalInfo?: string;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => User, user => user.absences, { eager: true })
  user: User;
}
