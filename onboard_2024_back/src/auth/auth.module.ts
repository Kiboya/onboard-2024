import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service'; // Adjust the path as necessary

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Assurez-vous d'importer votre entité User
    JwtModule.register({
      secret: 'your_secret_key', // Remplacez par votre clé secrète
      signOptions: { expiresIn: '60s' }, // Optionnel : temps d'expiration du token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
