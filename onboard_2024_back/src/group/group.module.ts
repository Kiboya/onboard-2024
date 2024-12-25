// src/group/group.module.ts

// Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// Controllers
import { GroupController } from './group.controller';

// Services
import { GroupService } from './group.service';

// Entities
import { Group } from './group.entity';

// Other Modules
import { AuthModule } from 'src/auth/auth.module';

/**
 * @fileoverview Defines the group module, configuring imports, controllers, and providers for group-related functionalities.
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([Group]),
        AuthModule,
    ],
    controllers: [GroupController],
    providers: [GroupService],
})
export class GroupModule { }