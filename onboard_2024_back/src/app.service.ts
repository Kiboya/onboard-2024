// src/app.service.ts

// Modules
import { Injectable } from '@nestjs/common';

/**
 * @fileoverview Provides application-level services, such as returning greeting messages.
 */
@Injectable()
export class AppService {
  /**
   * Returns a greeting message.
   *
   * @returns A string containing the greeting.
   */
  getHello(): string {
    return 'Hello World!';
  }
}