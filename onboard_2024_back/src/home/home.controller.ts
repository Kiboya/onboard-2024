// src/home/home.controller.ts

// Modules
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

// Services
import { HomeService } from './home.service';

// Guards
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * @fileoverview Handles card-related operations such as retrieving all cards.
 */
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) { }

  /**
   * Retrieves all cards with their contents ordered and mapped based on language.
   *
   * @param req - The request object.
   * @returns An array of mapped Card objects.
   */
  @UseGuards(JwtAuthGuard)
  @Get('cards')
  async getAllCards(@Req() req: any) {
    const lang = this.getLanguage(req);
    return this.homeService.getAllCards(lang);
  }

  /**
   * Retrieves the language from the request headers.
   * @param req - The request object.
   * @returns The language code.
   */
  private getLanguage(req: any): 'en' | 'fr' {
    const langHeader = req.headers['accept-language'] || req.headers['x-lang'];
    return langHeader?.toLowerCase() === 'en' ? 'en' : 'fr';
  }
}