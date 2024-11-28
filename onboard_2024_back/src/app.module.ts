import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { PlanningModule } from './planning/planning.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';

dotenv.config();


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,      
      database: 'onboard',
      entities: [User],
      synchronize: true,
    }),
    PlanningModule,
    AuthModule,
    User,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
