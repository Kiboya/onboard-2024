// src/course/course.entity.ts

// Modules
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    OneToMany,
    JoinTable,
  } from 'typeorm';
  
  // Entities
  import { Group } from '../group/group.entity';
  import { Class } from '../class/class.entity';
  
  /**
   * @fileoverview Defines the Course entity with its properties and relationships to other entities.
   */
  @Entity('courses')
  export class Course {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column({ nullable: true })
    name_en: string;
  
    @ManyToMany(() => Group, group => group.courses)
    @JoinTable({
      name: 'group_courses',
      joinColumn: { name: 'course_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'group_id', referencedColumnName: 'id' },
    })
    groups: Group[];
  
    @OneToMany(() => Class, classEntity => classEntity.course)
    classes: Class[];
  }