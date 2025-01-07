// src/user/user.entity.ts

// Modules
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

// Entities
import { Group } from '../group/group.entity';
import { Absence } from '../absence/absence.entity';

/**
 * @fileoverview Defines the User entity with its properties and relationships to other entities.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToMany(() => Group, group => group.users, { eager: true })
  @JoinTable({
    name: 'user_groups',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'group_id', referencedColumnName: 'id' },
  })
  groups: Group[];

  @OneToMany(() => Absence, absence => absence.user)
  absences: Absence[];
}