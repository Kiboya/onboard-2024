// src/home/home.module.ts

// Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

// Controllers
import { HomeController } from './home.controller';

// Services
import { HomeService } from './home.service';

// Entities
import { Card } from './home-card.entity';
import { CardContent } from './home-card-content.entity';

/**
 * @fileoverview Defines the home module, configuring imports, controllers, and providers.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Card, CardContent]),
    AuthModule,
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}