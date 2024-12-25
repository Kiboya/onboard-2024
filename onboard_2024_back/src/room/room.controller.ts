// src/room/room.controller.ts

// Modules
import {
    Controller,
    Get,
    Req,
    UseGuards,
} from '@nestjs/common';

// Services
import { RoomService } from './room.service';

// Guards
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// DTOs
import { RoomResponseDto } from '../dto/room-response.dto';

/**
 * @fileoverview Handles room-related operations such as retrieving all rooms.
 */
@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) { }

    private getLanguage(req: any): 'en' | 'fr' {
        const langHeader = req.headers['accept-language'] || req.headers['x-lang'];
        return langHeader === 'en' ? 'en' : 'fr';
    }

    /**
     * Retrieves all rooms.
     *
     * @param req - The request object containing the language preference.
     * @returns An array of RoomResponseDto objects.
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllRooms(@Req() req: any): Promise<RoomResponseDto[]> {
        const lang = this.getLanguage(req);
        return this.roomService.getAllRooms(lang);
    }
}