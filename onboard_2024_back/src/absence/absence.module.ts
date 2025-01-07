// src/absence/absence.module.ts

// Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { AbsenceController } from './absence.controller';

// Services
import { AbsenceService } from './absence.service';

// Entities
import { Absence } from './absence.entity';
import { User } from '../user/user.entity';
import { AuthModule } from 'src/auth/auth.module';

/**
 * @fileoverview Defines the absence module, configuring imports, controllers, and providers for absence-related functionalities.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Absence, User]),
    AuthModule,
  ],
  controllers: [AbsenceController],
  providers: [AbsenceService],
})
export class AbsenceModule { }
