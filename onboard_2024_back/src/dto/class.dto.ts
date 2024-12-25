import { Course } from 'src/course/course.entity';
import { Group } from 'src/group/group.entity';
import { Professor } from 'src/professor/professor.entity';
import { Room } from 'src/room/room.entity';

export class ClassDto {
    date: Date;
    startingTime: string;
    endingTime: string;
    classType: string;
    classType_en: string;
    labelCode: string;
    course: Course;
    room: Room;
    groups: Group[];
    professors: Professor[];
  }