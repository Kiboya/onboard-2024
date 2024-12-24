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
  import { Class } from '../class/class.entity';
  
  /**
   * @fileoverview Defines the Group entity with its properties and relationships to other entities.
   */
  @Entity('groups')
  export class Group {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    name: string;
  
    @ManyToMany(() => User, user => user.groups)
    users: User[];
  
    @ManyToMany(() => Course, course => course.groups)
    courses: Course[];
  
    @ManyToMany(() => Class, classEntity => classEntity.groups)
    classes: Class[];
  }