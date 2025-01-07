// src/absence/absence.service.ts

// Modules
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

// DTOs
import { AbsenceDto } from '../dto/absence.dto';

// Entities
import { Absence } from './absence.entity';
import { User } from '../user/user.entity';

// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Utilities
import { JwtService } from '@nestjs/jwt';

/**
 * @fileoverview Provides services for managing absences, including retrieval, creation, and status updates.
 */
@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(Absence)
    private absenceRepository: Repository<Absence>,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  /**
   * Retrieves all absences.
   *
   * @returns A promise that resolves to an array of Absence entities.
   */
  findAll(): Promise<Absence[]> {
    return this.absenceRepository.find();
  }

  /**
   * Creates a new absence.
   *
   * @param absenceDto - The DTO containing absence information.
   * @param userId - The ID of the user creating the absence.
   * @returns A promise that resolves to the newly created Absence entity.
   */
  async createAbsence(absenceDto: AbsenceDto, userId: number): Promise<Absence> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const absence = this.absenceRepository.create({ ...absenceDto, user });
    return this.absenceRepository.save(absence);
  }

  /**
   * Retrieves absences associated with a user based on the provided JWT token.
   *
   * @param token - The JWT token of the authenticated user.
   * @returns An array of Absence entities.
   * @throws {UnauthorizedException} If the token is invalid.
   * @throws {NotFoundException} If the user is not found.
   */
  async getAbsencesForUser(token: string): Promise<Absence[]> {
    // Decode the token to retrieve the user ID.
    const decoded = this.jwtService.decode(token) as any;
    const userId = decoded?.sub;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    // Retrieve the user based on the user ID.
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['absences'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Return the absences associated with the user.
    return user.absences;
  }
}