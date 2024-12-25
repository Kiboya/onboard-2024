// src/group/group.controller.ts

// Modules
import {
    Controller,
    Get,
    Req,
    UseGuards,
} from '@nestjs/common';

// Services
import { GroupService } from './group.service';

// Guards
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// DTOs
import { GroupResponseDto } from '../dto/group-response.dto';

/**
 * @fileoverview Handles group-related operations such as retrieving all groups.
 */
@Controller('groups')
export class GroupController {
    constructor(private readonly groupService: GroupService) { }

    private getLanguage(req: any): 'en' | 'fr' {
        const langHeader = req.headers['accept-language'] || req.headers['x-lang'];
        return langHeader === 'en' ? 'en' : 'fr';
    }

    /**
     * Retrieves all groups.
     *
     * @param req - The request object containing the language preference.
     * @returns An array of GroupResponseDto objects.
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllGroups(@Req() req: any): Promise<GroupResponseDto[]> {
        const lang = this.getLanguage(req);
        return this.groupService.getAllGroups(lang);
    }
}