// src/user/user.service.ts

// Modules
import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// DTOs
import { UserDto, UserInfoDto } from 'src/dto/user.dto';

// Entities
import { User } from './user.entity';

// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Utilities
import { JwtService } from '@nestjs/jwt';

/**
 * @fileoverview Provides services for managing users, including retrieval, creation, and profile updates.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  /**
   * Retrieves all users.
   *
   * @returns A promise that resolves to an array of User entities.
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Finds a user by their username.
   *
   * @param username - The username of the user.
   * @returns A promise that resolves to the User entity or undefined if not found.
   */
  async findOneByLogin(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  /**
   * Finds a user by their ID.
   *
   * @param id - The ID of the user.
   * @returns A promise that resolves to the User entity.
   */
  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  /**
   * Retrieves the profile information of a user based on their JWT token.
   *
   * @param token - The JWT token of the authenticated user.
   * @param lang - The language in which to retrieve the data.
   * @returns A promise that resolves to the UserInfoDto.
   * @throws {UnauthorizedException} If the token is invalid.
   */
  async getProfile(token: string, lang: 'en' | 'fr' = 'fr'): Promise<UserInfoDto> {
    const decoded = this.jwtService.decode(token) as any;
    const userId = decoded?.sub;
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['groups', 'groups.courses']
    });

    // Get unique courses from all groups by course ID
    const uniqueCourses = Array.from(
      new Map(
        user.groups.flatMap(group => group.courses)
          .map(course => [course.id, course])
      ).values()
    );

    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      mobilePhone: user.mobilePhone,
      email: user.email,
      groups: user.groups.map(g => ({
        ...g,
        name: lang === 'en' && g.name_en ? g.name_en : g.name,
      })),
      courses: uniqueCourses.map(c => ({
        ...c,
        name: lang === 'en' && c.name_en ? c.name_en : c.name,
      }))
    };
  }

  /**
   * Updates the profile of a user based on their JWT token.
   *
   * @param token - The JWT token of the authenticated user.
   * @param updateUserDto - The DTO containing updated user information.
   * @returns A promise that resolves to the updated User entity.
   * @throws {UnauthorizedException} If the token is invalid.
   */
  async updateProfile(token: string, updateUserInfoDto: UserInfoDto): Promise<UserInfoDto> {
    const user = await this.getProfile(token);

    Object.assign(user, updateUserInfoDto);
    return await this.usersRepository.save(user);
  }

  /**
   * Creates a new user.
   *
   * @param user - The User entity to be created.
   * @returns A promise that resolves to the newly created User entity.
   * @throws {ConflictException} If a user with the same username already exists.
   */
  async createUser(user: User): Promise<User> {
    const existingUser = await this.findOneByLogin(user.username);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }
}