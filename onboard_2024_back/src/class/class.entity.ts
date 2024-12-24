// src/class/class.entity.ts

// Modules
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

// Entities
import { Course } from '../course/course.entity';
import { Group } from '../group/group.entity';
import { Room } from '../room/room.entity';
import { Professor } from '../professor/professor.entity';

/**
 * @fileoverview Defines the Class entity with its properties and relationships to other entities.
 */
@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startingTime: string;

  @Column({ type: 'time' })
  endingTime: string;

  @Column()
  classType: string;

  @ManyToOne(() => Course, course => course.classes, { eager: true })
  course: Course;

  @ManyToOne(() => Room, room => room.classes, { eager: true })
  room: Room;

  @ManyToMany(() => Group, group => group.classes, { eager: true })
  @JoinTable({
      name: 'class_groups',
      joinColumn: { name: 'class_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'group_id', referencedColumnName: 'id' },
  })
  groups: Group[];

  @ManyToMany(() => Professor, professor => professor.classes, { eager: true })
  @JoinTable({
      name: 'class_professors',
      joinColumn: { name: 'class_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'professor_id', referencedColumnName: 'id' },
  })
  professors: Professor[];
}