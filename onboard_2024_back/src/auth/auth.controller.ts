import { Controller, Body, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    
    const user: UserDto = await this.authService.validateUser(username, password);
  
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.authService.login(user);

    return { message: 'Login successful', user, token };
  }

  @Post('register')
  async register(@Body() userDto: UserDto) {
    const user = await this.authService.register(userDto);
    return { message: 'User registered successfully', user };
  }
}