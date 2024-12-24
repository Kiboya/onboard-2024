// src/auth/auth.module.ts

// Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Controllers
import { AuthController } from './auth.controller';
// Services
import { AuthService } from './auth.service';
import { UsersService } from 'src/user/user.service';
// Entities
import { User } from 'src/user/user.entity';
// JWT 
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

/**
 * @fileoverview Defines the authentication module, configuring imports, controllers, providers, and exports for authentication-related functionalities.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}