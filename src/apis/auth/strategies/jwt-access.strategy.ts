import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        if (!req.cookies.refreshToken) throw new UnauthorizedException();

        const cookie = req.cookies.refreshToken;
        const refreshToken = cookie.replace('accessToken=', '');
        return refreshToken;
      },
      secretOrKey: process.env.ACCESS_SECRET_KEY,
    });
  }

  validate(payload) {
    return {
      id: payload.sub,
    };
  }
}
