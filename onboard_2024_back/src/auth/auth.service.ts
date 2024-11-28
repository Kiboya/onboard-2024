import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { ConflictException } from '@nestjs/common';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }
  async validateUser(login: string, password: string): Promise<UserDto | null> {
    const user = await this.usersService.findOneByLogin(login);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const userDto: UserDto = {
          username: user.username,
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

  async register(userDto: UserDto): Promise<User> {
    console.log('Registering user', userDto);
    const existingUser = await this.usersService.findOneByLogin(userDto.username);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = await this.usersService.createUser({
      username: userDto.username,
      password: hashedPassword,
    });
    return newUser;
  }
}
