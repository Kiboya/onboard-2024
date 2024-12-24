// Modules
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

// Services
import { UsersService } from 'src/user/user.service';

/**
 * @fileoverview Provides JWT authentication strategy by extending Passport's Strategy class, validating JWT tokens, and extracting user information.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  /**
   * Creates an instance of JwtStrategy.
   *
   * @param usersService - The user service to fetch user details.
   */
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validates the JWT token and returns the user if it is valid.
   *
   * @param payload - The payload extracted from the JWT token.
   * @returns The user if the token is valid.
   * @throws {UnauthorizedException} Throws an error if the user is not found.
   */
  async validate(payload: any) {
    const user = await this.usersService.findOneByLogin(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}