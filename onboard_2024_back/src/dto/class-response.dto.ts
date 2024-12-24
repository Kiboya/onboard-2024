// src/class/dto/class-response.dto.ts
import { Course } from 'src/course/course.entity';
import { Room } from 'src/room/room.entity';
import { Professor } from 'src/professor/professor.entity';
import { Group } from 'src/group/group.entity';
import { User } from 'src/user/user.entity';
import { UserDto } from './user.dto';

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