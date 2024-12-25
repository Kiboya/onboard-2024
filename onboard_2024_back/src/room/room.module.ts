// src/room/room.module.ts

// Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// Controllers
import { RoomController } from './room.controller';

// Services
import { RoomService } from './room.service';

// Entities
import { Room } from './room.entity';

// Other Modules
import { AuthModule } from 'src/auth/auth.module';

/**
 * @fileoverview Defines the room module, configuring imports, controllers, and providers for room-related functionalities.
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([Room]),
        AuthModule,
    ],
    controllers: [RoomController],
    providers: [RoomService],
})
export class RoomModule { }