// src/dto/user.dto.ts

// Modules
import { Group } from '../group/group.entity';
import { Course } from '../course/course.entity';

/**
 * @fileoverview Defines the data transfer objects for users.
 */

/**
 * Defines the UserDto class to represent the data transfer object for users.
 */
export class UserDto {
    username: string;
    firstName: string;
    lastName: string;
}

/**
 * Defines the UserInfoDto class to represent the data transfer object for user information.
 */
export class UserInfoDto {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    mobilePhone: string;
    email: string;
    groups: Group[];
    courses: Course[];
}