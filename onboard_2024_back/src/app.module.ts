// src/app.module.ts

// Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

// Other Modules
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './class/class.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { GroupModule } from './group/group.module';

/**
 * @fileoverview Defines the root application module, configuring imports, controllers, and providers.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    AuthModule,
    ClassModule,
    UserModule,
    RoomModule,
    GroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}