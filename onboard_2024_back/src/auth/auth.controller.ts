// src/auth/auth.controller.ts

// Modules
import { Controller, Body, HttpException, HttpStatus, Post } from '@nestjs/common';
// Services
import { AuthService } from './auth.service';

/**
 * @fileoverview Handles authentication-related operations such as user login and registration.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * Logs in a user with the provided username and password.
   *
   * @param body - An object containing the username and password.
   * @returns An object with a success message, user details, and a JWT token.
   * @throws {HttpException} Throws an error if the credentials are invalid.
   */
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const token = await this.authService.login(user);
    return {
      message: 'Login successful',
      user: { username: user.username },
      token,
    };
  }

  /**
   * Registers a new user with the provided details.
   *
   * @param body - An object containing the username, password, firstName, and lastName.
   * @returns An object with a success message and the registered user details.
   */
  @Post('register')
  async register(@Body() body: { username: string; password: string, firstName: string, lastName: string }) {
    const { username, password, firstName, lastName } = body;
    const user = await this.authService.register(username, password, firstName, lastName);
    return { message: 'User registered successfully', user };
  }
}