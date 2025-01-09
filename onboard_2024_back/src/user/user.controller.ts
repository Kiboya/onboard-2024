// src/user/user.controller.ts

// Modules
import { Controller, Get, UseGuards, Request } from '@nestjs/common';

// Services
import { UsersService } from './user.service';

// Guards
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// DTOs
import { UserInfoDto } from 'src/dto/user.dto';

/**
 * @fileoverview Handles user-related operations such as retrieving user profiles.
 */
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * Retrieves the language from the request headers.
   *
   * @param req - The request object containing the accept-language header.
   * @returns The language code.
   */
  private getLanguage(req: any): 'en' | 'fr' {
    const langHeader = req.headers['accept-language'] || req.headers['x-lang'];
    return langHeader === 'en' ? 'en' : 'fr';
  }

  /**
   * Retrieves the profile of the authenticated user.
   *
   * @param req - The request object containing the authorization header.
   * @returns An object containing the user's id, username, and groups.
   * @throws {UnauthorizedException} If the token is invalid or the user is not found.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserInfoDto> {
    const token = req.headers.authorization.split(' ')[1];
    const lang = this.getLanguage(req);
    return this.usersService.getProfile(token, lang);
  }
}