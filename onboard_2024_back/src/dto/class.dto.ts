// src/dto/class.dto.ts

// Entities
import { Course } from 'src/course/course.entity';
import { Professor } from 'src/professor/professor.entity';
import { Room } from 'src/room/room.entity';

/**
 * @fileoverview Defines the ClassDto class to represent the data transfer object for classes.
 */
export class ClassDto {
  date: Date;
  startingTime: string;
  endingTime: string;
  classType: string;
  classType_en: string;
  labelCode: string;
  course: Course;
  room: Room;
  professors: Professor[];
}