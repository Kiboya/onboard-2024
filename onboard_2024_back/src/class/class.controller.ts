// src/class/class.controller.ts

// Modules
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

// Services
import { ClassService } from './class.service';

// Guards
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// DTOs
import { ClassDto } from 'src/dto/class.dto';
import { ClassResponseDto } from 'src/dto/class-response.dto';

// Entities
import { Class } from './class.entity';

/**
 * @fileoverview Handles class-related operations such as retrieving user classes, filtering by groups or rooms, and adding new classes.
 */
@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  private getLanguage(req: any): 'en' | 'fr' {
    const langHeader = req.headers['accept-language'] || req.headers['x-lang'];
    return langHeader === 'en' ? 'en' : 'fr';
  }

  /**
   * Retrieves classes associated with the authenticated user.
   *
   * @param req - The request object containing the authorization header and language preference.
   * @returns An array of ClassResponseDto objects.
   * @throws {UnauthorizedException} If the token is invalid.
   */
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserClasses(@Req() req: any): Promise<ClassResponseDto[]> {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const lang = this.getLanguage(req);
      return await this.classService.getClassesForUser(token, lang);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves classes based on the provided group IDs.
   *
   * @param groupIds - A comma-separated string of group IDs.
   * @param req - The request object containing the language preference.
   * @returns An array of ClassResponseDto objects.
   */
  @UseGuards(JwtAuthGuard)
  @Get('group')
  async getClassesByGroups(
    @Query('groupIds') groupIds: string,
    @Req() req: any
  ): Promise<ClassResponseDto[]> {
    const ids = groupIds.split(',').map(id => parseInt(id, 10));
    const lang = this.getLanguage(req);
    return this.classService.getClassesByGroups(ids, lang);
  }

  /**
   * Retrieves classes based on the provided room IDs.
   *
   * @param roomIds - A comma-separated string of room IDs.
   * @param req - The request object containing the language preference.
   * @returns An array of ClassResponseDto objects.
   */
  @UseGuards(JwtAuthGuard)
  @Get('rooms')
  async getClassesByRooms(
    @Query('roomIds') roomIds: string,
    @Req() req: any
  ): Promise<ClassResponseDto[]> {
    const ids = roomIds.split(',').map(id => parseInt(id, 10));
    const lang = this.getLanguage(req);
    return this.classService.getClassesByRooms(ids, lang);
  }

  /**
   * Adds a new class with the provided details.
   *
   * @param ClassDto - An object containing class details.
   * @returns An object with a success message and the added class instance.
   */
  @UseGuards(JwtAuthGuard)
  @Post('addclass')
  async addClass(@Body() ClassDto: ClassDto): Promise<{ message: string; class_instance: Class }> {
    const class_instance = await this.classService.addClass(ClassDto);
    return { message: 'Class added successfully', class_instance };
  }
}