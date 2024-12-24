// src/class/class.module.ts

// Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// Controllers
import { ClassController } from './class.controller';

// Services
import { ClassService } from './class.service';

// Entities
import { Class } from './class.entity';
import { User } from 'src/user/user.entity';

// Other Modules
import { AuthModule } from 'src/auth/auth.module';

/**
 * @fileoverview Defines the class module, configuring imports, controllers, and providers for class-related functionalities.
 */
@Module({
    imports: [
      TypeOrmModule.forFeature([Class, User]),
      AuthModule,
    ],
    controllers: [ClassController],
    providers: [ClassService],
})
export class ClassModule {}