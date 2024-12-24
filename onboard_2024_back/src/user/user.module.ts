// src/user/user.module.ts

// Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { UserController } from './user.controller';

// Services
import { UsersService } from './user.service';

// Entities
import { User } from './user.entity';

// Other Modules
import { AuthModule } from 'src/auth/auth.module';

/**
 * @fileoverview Defines the user module, configuring imports, controllers, providers, and exports for user-related functionalities.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UserModule {}