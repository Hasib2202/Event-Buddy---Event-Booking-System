// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Add this explicitly to avoid strict checks
      secretOrKey: jwtSecret, // Now always defined
    });
  }

  // async validate(payload: any) {
  //   return { userId: payload.sub, email: payload.email, role: payload.role };
  // }

  // src/auth/jwt.strategy.ts
  async validate(payload: any) {
    return {
      id: payload.sub, // Make sure this matches your JWT signing
      email: payload.email,
      role: payload.role
    };
  }
}
