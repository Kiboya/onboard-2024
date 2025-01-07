// src/absence/absence.controller.ts

// Modules
import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';

// Services
import { AbsenceService } from './absence.service';

// Guards
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// DTOs
import { AbsenceDto } from '../dto/absence.dto';

/**
 * @fileoverview Handles absence-related operations such as retrieving all absences and creating new absences.
 */
@Controller('absences')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) { }

  /**
   * Retrieves all absences.
   *
   * @returns An array of Absence entities.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllAbsences() {
    return this.absenceService.findAll();
  }

  /**
   * Retrieves absences associated with the authenticated user.
   *
   * @param req - The request object containing the authorization header.
   * @returns An array of Absence entities.
   * @throws {UnauthorizedException} If the token is invalid.
   */
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserAbsences(@Req() req: any) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      return await this.absenceService.getAbsencesForUser(token);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new absence.
   *
   * @param req - The request object containing the user information.
   * @param absenceDto - The DTO containing absence information.
   * @returns The newly created Absence entity.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createAbsence(@Req() req, @Body() absenceDto: AbsenceDto) {
    const userId = req.user.id;
    return this.absenceService.createAbsence(absenceDto, userId);
  }
}