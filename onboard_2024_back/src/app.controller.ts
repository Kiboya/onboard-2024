// src/app.controller.ts

// Modules
import { Controller, Get } from '@nestjs/common';

// Services
import { AppService } from './app.service';

/**
 * @fileoverview Handles application-level operations such as providing a basic health check endpoint.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Handles GET requests to the root path.
   *
   * @returns A greeting string.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}