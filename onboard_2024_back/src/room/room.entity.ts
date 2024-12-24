// src/room/room.entity.ts

// Modules
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
  } from 'typeorm';
  
  // Entities
  import { Class } from '../class/class.entity';
  
  /**
   * @fileoverview Defines the Room entity with its properties and relationships to other entities.
   */
  @Entity('rooms')
  export class Room {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    name: string;
  
    @OneToMany(() => Class, classEntity => classEntity.room)
    classes: Class[];
  }