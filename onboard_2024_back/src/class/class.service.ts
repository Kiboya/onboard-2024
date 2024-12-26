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
    // Create a new class instance with the provided details.
    const class_instance = this.classRepository.create({
      ...ClassDto,
      classType: ClassDto.classType as "Cours Magistral" | "Travaux Pratiques" | "Travaux Dirigés" | "Devoir Surveillé" | "Evénement",
      classType_en: ClassDto.classType_en as "Lecture" | "Lab" | "Tutorials" | "Test" | "Event",
    });
    return await this.classRepository.save(class_instance);
  }

  /**
   * Retrieves classes associated with a user based on the provided JWT token.
   *
   * @param token - The JWT token of the authenticated user.
   * @param lang - The language in which to retrieve the data.
   * @returns An array of ClassResponseDto objects.
   * @throws {UnauthorizedException} If the token is invalid.
   * @throws {NotFoundException} If the user is not found.
   */
  async getClassesForUser(token: string, lang: 'en' | 'fr' = 'fr'): Promise<ClassResponseDto[]> {
    // Decode the token to retrieve the user ID.
    const decoded = this.jwtService.decode(token) as any;
    const userId = decoded?.sub;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    // Retrieve the user based on the user ID and include the groups, courses, and classes.
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['groups', 'groups.courses', 'groups.courses.classes'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Retrieve the classes associated with the user.
    const classes = user.groups
      .flatMap(group => group.courses)
      .flatMap(course => course.classes);

    if (classes.length === 0) {
      return [];
    }

    // Remove duplicate classes 
    // (certains classes may be associated with multiple groups and if a user is in multiple groups, the same class may appear multiple times).
    const uniqueClasses = Array.from(new Set(classes.map(cls => cls.id)))
      .map(id => classes.find(cls => cls.id === id)!)
      .filter(cls => cls !== undefined);

    // Retrieve the classes with groups, attendees, and professors
    const classesWithGroups = await this.classRepository.find({
      where: { id: In(uniqueClasses.map(cls => cls.id)) },
      relations: ['course', 'room', 'course.groups', 'course.groups.users', 'professors'],
    });

    // Retrieve the classes with attendees and return the data in the specified language.
    const classesWithAttendees = classesWithGroups.map(cls => ({
      ...cls,
      classType: lang === 'en' && cls.classType_en ? cls.classType_en : cls.classType,
      course: {
        ...cls.course,
        name: lang === 'en' && cls.course.name_en ? cls.course.name_en : cls.course.name,
      },
      groups: cls.course.groups.map(g => ({
        ...g,
        name: lang === 'en' && g.name_en ? g.name_en : g.name,
      })),
      // Remove duplicate attendees 
      // (a user may be in multiple groups and if a class is associated with multiple groups, the same user may appear multiple times).
      attendees: Array.from(new Set(cls.course.groups.flatMap(group => group.users.map(u => u.id))))
        .map(id => {
          const user = cls.course.groups.flatMap(g => g.users).find(u => u.id === id);
          return user ? {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
          } : null;
        })
        .filter(u => u !== null),
    }));

    // Return the classes with attendees.
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
   * Retrieves classes based on the provided group IDs.
   *
   * @param groupIds - An array of group IDs.
   * @param lang - The language in which to retrieve the data.
   * @returns An array of ClassResponseDto objects.
   */
  async getClassesByGroups(groupIds: number[], lang: 'en' | 'fr' = 'fr'): Promise<ClassResponseDto[]> {

    // Retrieve the classes based on the provided group IDs and include the course, room, groups, and professors.
    const classes = await this.classRepository.find({
      where: { course: { groups: { id: In(groupIds) } } },
      relations: ['course', 'room', 'course.groups', 'course.groups.users', 'professors'],
    });

    // Return the classes in the specified language.
    return classes.map(cls => ({
      id: cls.id,
      date: cls.date,
      startingTime: cls.startingTime,
      endingTime: cls.endingTime,
      classType: lang === 'en' && cls.classType_en ? cls.classType_en : cls.classType,
      course: {
        ...cls.course,
        name: lang === 'en' && cls.course.name_en ? cls.course.name_en : cls.course.name,
      },
      room: cls.room,
      groups: cls.course.groups.map(g => ({
        ...g,
        name: lang === 'en' && g.name_en ? g.name_en : g.name,
      })),
      professors: cls.professors,
      attendees: Array.from(new Set(cls.course.groups.flatMap(g => g.users.map(u => u.id))))
        .map(id => {
          const user = cls.course.groups.flatMap(g => g.users).find(u => u.id === id);
          return user ? {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
          } : null;
        })
        .filter(u => u !== null),
    }));
  }

  /**
   * Retrieves classes based on the provided room IDs.
   *
   * @param roomIds - An array of room IDs.
   * @param lang - The language in which to retrieve the data.
   * @returns An array of ClassResponseDto objects.
   */
  async getClassesByRooms(roomIds: number[], lang: 'en' | 'fr' = 'fr'): Promise<ClassResponseDto[]> {
    // Retrieve the classes based on the provided room IDs and include the course, room, groups, and professors.
    const classes = await this.classRepository.find({
      where: { room: { id: In(roomIds) } },
      relations: ['course', 'room', 'course.groups', 'course.groups.users', 'professors'],
    });

    // Return the classes in the specified language.
    return classes.map(cls => ({
      id: cls.id,
      date: cls.date,
      startingTime: cls.startingTime,
      endingTime: cls.endingTime,
      classType: lang === 'en' && cls.classType_en ? cls.classType_en : cls.classType,
      course: {
        ...cls.course,
        name: lang === 'en' && cls.course.name_en ? cls.course.name_en : cls.course.name,
      },
      room: cls.room,
      groups: cls.course.groups.map(g => ({
        ...g,
        name: lang === 'en' && g.name_en ? g.name_en : g.name,
      })),
      professors: cls.professors,
      attendees: Array.from(new Set(cls.course.groups.flatMap(g => g.users.map(u => u.id))))
        .map(id => {
          const user = cls.course.groups.flatMap(g => g.users).find(u => u.id === id);
          return user ? {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
          } : null;
        })
        .filter(u => u !== null),
    }));
  }
}