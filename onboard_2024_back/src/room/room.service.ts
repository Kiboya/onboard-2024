// src/room/room.service.ts

// Modules
import { Injectable } from '@nestjs/common';

// DTOs
import { RoomResponseDto } from '../dto/room-response.dto';

// Entities
import { Room } from './room.entity';

// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * @fileoverview Provides services for managing rooms, including retrieving all rooms.
 */
@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  /**
   * Retrieves all rooms with language support.
   *
   * @param lang - The language in which to retrieve the data.
   * @returns An array of RoomResponseDto objects.
   */
  async getAllRooms(lang: 'en' | 'fr'): Promise<RoomResponseDto[]> {
    const rooms = await this.roomRepository.find();

    return rooms.map(room => ({
      id: room.id,
      name: room.name, // No language support for rooms
    }));
  }
}