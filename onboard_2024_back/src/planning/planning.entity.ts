import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

@Entity('planning')
export class Planning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startingTime: string;

  @Column({ type: 'time' })
  endingTime: string;

  @Column()
  courseCode: string;

  @Column()
  courseName: string;

  @Column()
  courseModule: string;

  @Column()
  classType: string;

  @Column()
  groupCode: string;

  @Column()
  labelCode: string;

  @Column()
  room: string;

  @Column()
  instructors: string;
}