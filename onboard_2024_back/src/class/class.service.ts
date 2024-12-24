// src/class/class.service.ts

// Modules
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

// DTOs
import { ClassDto } from 'src/dto/class.dto';
import { ClassResponseDto } from 'src/dto/class-response.dto';

// Entities
import { Class } from './class.entity';
import { User } from 'src/user/user.entity';

// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

// Utilities
import { JwtService } from '@nestjs/jwt';

/**
 * @fileoverview Provides services for managing classes, including adding classes and retrieving classes based on user, groups, or rooms.
 */
@Injectable()
export class ClassService {

    constructor(
        @InjectRepository(Class)
        private classRepository: Repository<Class>,
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    /**
     * Adds a new class with the provided details.
     *
     * @param ClassDto - Data Transfer Object containing class details.
     * @returns The newly created Class entity.
     */
    async addClass(ClassDto: ClassDto): Promise<Class> {
        const class_instance = this.classRepository.create(ClassDto);
        return await this.classRepository.save(class_instance);
    }

    /**
     * Retrieves classes associated with a user based on the provided JWT token.
     *
     * @param token - The JWT token of the authenticated user.
     * @returns An array of ClassResponseDto objects.
     * @throws {UnauthorizedException} If the token is invalid.
     * @throws {NotFoundException} If the user is not found.
     */
    async getClassesForUser(token: string): Promise<ClassResponseDto[]> {
        const decoded = this.jwtService.decode(token) as any;

        const userId = decoded?.sub;

        if (!userId) {
            throw new UnauthorizedException('Invalid token');
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['groups', 'groups.courses', 'groups.courses.classes'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const classes = user.groups
            .flatMap(group => group.courses)
            .flatMap(course => course.classes);

        if (classes.length === 0) {
            return [];
        }

        const classIds = Array.from(new Set(classes.map(cls => cls.id)));

        const classesWithGroups = await this.classRepository.find({
            where: { id: In(classIds) },
            relations: ['groups', 'groups.users', 'course', 'room', 'professors'],
        });

        const classesWithAttendees = classesWithGroups.map(cls => ({
            ...cls,
            attendees: Array.from(new Set(cls.groups.flatMap(group => group.users))).map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
            })),
        }));

        const result = classesWithAttendees.map(cls => ({
            id: cls.id,
            date: cls.date,
            startingTime: cls.startingTime,
            endingTime: cls.endingTime,
            classType: cls.classType,
            course: cls.course,
            room: cls.room,
            groups: cls.groups,
            professors: cls.professors,
            attendees: cls.attendees,
        }));

        return result;
    }

    /**
     * Retrieves classes based on the provided group IDs.
     *
     * @param groupIds - An array of group IDs.
     * @returns An array of ClassResponseDto objects.
     */
    async getClassesByGroups(groupIds: number[]): Promise<ClassResponseDto[]> {
        const classes = await this.classRepository.find({
            where: {
                groups: { id: In(groupIds) },
            },
            relations: ['course', 'room', 'groups', 'groups.users', 'professors'],
        });

        const classesWithAttendees = classes.map(cls => ({
            ...cls,
            attendees: Array.from(new Set(cls.groups.flatMap(group => group.users))),
        }));

        return classesWithAttendees.map(cls => ({
            id: cls.id,
            date: cls.date,
            startingTime: cls.startingTime,
            endingTime: cls.endingTime,
            classType: cls.classType,
            course: cls.course,
            room: cls.room,
            groups: cls.groups,
            professors: cls.professors,
            attendees: cls.attendees,
        }));
    }

    /**
     * Retrieves classes based on the provided room IDs.
     *
     * @param roomIds - An array of room IDs.
     * @returns An array of ClassResponseDto objects.
     */
    async getClassesByRooms(roomIds: number[]): Promise<ClassResponseDto[]> {
        const classes = await this.classRepository.find({
            where: {
                room: { id: In(roomIds) },
            },
            relations: ['course', 'room', 'groups', 'groups.users', 'professors'],
        });

        const classesWithAttendees = classes.map(cls => ({
            ...cls,
            attendees: Array.from(new Set(cls.groups.flatMap(group => group.users))),
        }));

        return classesWithAttendees.map(cls => ({
            id: cls.id,
            date: cls.date,
            startingTime: cls.startingTime,
            endingTime: cls.endingTime,
            classType: cls.classType,
            course: cls.course,
            room: cls.room,
            groups: cls.groups,
            professors: cls.professors,
            attendees: cls.attendees,
        }));
    }
}