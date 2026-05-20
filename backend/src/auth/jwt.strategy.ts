import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

//déf structure exacte de ce qu'il y a dans Token JWT
interface JwtPayload {
  sub: number;
  email: string;
  package: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret', // Fallback pour éviter l'erreur de type
    });
  }

  validate(payload: JwtPayload) {
    return { 
      userId: payload.sub, 
      email: payload.email, 
      package: payload.package,
      role: payload.role
    };
  }
}
