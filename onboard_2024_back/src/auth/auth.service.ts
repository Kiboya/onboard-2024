import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
      ){}
      async validateUser(login: string, password: string): Promise<UserDto | null> {
        const user = await this.usersService.findOneByLogin(login);
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
        const userDto: UserDto = {
          login: user.username,
          password: user.password
        };
        return userDto;
          }
        }
        return null;
      }
      // Génération du JWT après validation de l'utilisateur
      async login(user: any) {
        const payload = { login: user.username, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
}
