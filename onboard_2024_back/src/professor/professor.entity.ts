// src/professor/professor.entity.ts

// Modules
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
  } from 'typeorm';
  
  // Entities
  import { Class } from '../class/class.entity';
  
  /**
   * @fileoverview Defines the Professor entity with its properties and relationships to other entities.
   */
  @Entity('professors')
  export class Professor {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @ManyToMany(() => Class, classEntity => classEntity.professors)
    classes: Class[];
  }