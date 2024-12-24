// src/auth/jwt-auth.guard.ts

// Modules
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @fileoverview Provides a guard for JWT authentication.
 * This guard is called in the controller to protect routes that require authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}