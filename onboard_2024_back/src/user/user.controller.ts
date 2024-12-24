// src/user/user.controller.ts

// Modules
import { Controller, Get, UseGuards, Request } from '@nestjs/common';

// Services
import { UsersService } from './user.service';

// Guards
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

/**
 * @fileoverview Handles user-related operations such as retrieving user profiles.
 */
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves the profile of the authenticated user.
   *
   * @param req - The request object containing the authorization header.
   * @returns An object containing the user's id, username, and groups.
   * @throws {UnauthorizedException} If the token is invalid or the user is not found.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    const user = await this.usersService.findProfile(token);
    return {
      id: user.id,
      username: user.username,
      groups: user.groups,
    };
  }
}