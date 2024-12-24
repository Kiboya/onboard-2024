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

  /**
   * Retrieves classes associated with the authenticated user.
   *
   * @param req - The request object containing the authorization header.
   * @returns An array of ClassResponseDto objects.
   * @throws {UnauthorizedException} If the token is invalid.
   */
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserClasses(@Req() req: any): Promise<ClassResponseDto[]> {
    try {
      const token = req.headers.authorization.split(' ')[1];
      return await this.classService.getClassesForUser(token);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves classes based on the provided group IDs.
   *
   * @param groupIds - A comma-separated string of group IDs.
   * @returns An array of ClassResponseDto objects.
   */
  @UseGuards(JwtAuthGuard)
  @Get('group')
  async getClassesByGroups(
    @Query('groupIds') groupIds: string
  ): Promise<ClassResponseDto[]> {
    const ids = groupIds.split(',').map(id => parseInt(id, 10));
    return this.classService.getClassesByGroups(ids);
  }

  /**
   * Retrieves classes based on the provided room IDs.
   *
   * @param roomIds - A comma-separated string of room IDs.
   * @returns An array of ClassResponseDto objects.
   */
  @UseGuards(JwtAuthGuard)
  @Get('rooms')
  async getClassesByRooms(
    @Query('roomIds') roomIds: string
  ): Promise<ClassResponseDto[]> {
    const ids = roomIds.split(',').map(id => parseInt(id, 10));
    return this.classService.getClassesByRooms(ids);
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