// src/class/dto/class-response.dto.ts

// Entities
import { Course } from 'src/course/course.entity';
import { Room } from 'src/room/room.entity';
import { Professor } from 'src/professor/professor.entity';
import { Group } from 'src/group/group.entity';

// DTOs
import { UserDto } from './user.dto';

/**
 * @fileoverview Defines the ClassResponseDto class to represent the data transfer object for class responses.
 */
export class ClassResponseDto {
    id: number;
    date: Date;
    startingTime: string;
    endingTime: string;
    classType: string;
    course: Course;
    room: Room;
    groups: Group[];
    professors: Professor[];
    attendees: UserDto[];
}