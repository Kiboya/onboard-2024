// src/group/group.entity.ts

// Modules
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
  } from 'typeorm';
  
  // Entities
  import { User } from '../user/user.entity';
  import { Course } from '../course/course.entity';
  
  /**
   * @fileoverview Defines the Group entity with its properties and relationships to other entities.
   */
  @Entity('groups')
  export class Group {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    name_en: string;
  
    @ManyToMany(() => User, user => user.groups)
    users: User[];
  
    @ManyToMany(() => Course, course => course.groups)
    courses: Course[];
  }