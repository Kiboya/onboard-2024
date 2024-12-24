// src/auth/auth.service.ts

// Modules
import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Services
import { UsersService } from 'src/user/user.service';

// Entities
import { User } from 'src/user/user.entity';

// JWT
import { JwtService } from '@nestjs/jwt';

/**
 * @fileoverview Provides authentication services, including user validation, login, and registration functionalities.
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  /**
   * Validates a user's credentials.
   *
   * @param username - The username of the user.
   * @param password - The plaintext password of the user.
   * @returns The authenticated user if validation is successful, otherwise null.
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByLogin(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  /**
   * Generates a JWT token for the authenticated user.
   *
   * @param user - The authenticated user.
   * @returns An object containing the JWT access token.
   */
  async login(user: User) {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Registers a new user with the provided details.
   *
   * @param username - The desired username for the new user.
   * @param password - The plaintext password for the new user.
   * @param firstName - The first name of the new user.
   * @param lastName - The last name of the new user.
   * @returns The newly created user.
   * @throws {ConflictException} If a user with the provided username already exists.
   */
  async register(username: string, password: string, firstName: string, lastName: string): Promise<User> {
    const existingUser = await this.usersService.findOneByLogin(username);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.username = username;
    newUser.password = hashedPassword;
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    return this.usersService.createUser(newUser);
  }
}