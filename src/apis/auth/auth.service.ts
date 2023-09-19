import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceGetRefreshToken,
  IAuthServiceRefresh,
  IAuthServiceSocialLogin,
} from './interfaces/auth-service.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getAccessToken({ userId }: IAuthServiceGetAccessToken): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, {
      secret: process.env.ACCESS_SECRET_KEY,
      expiresIn: '1d',
    });
  }

  private getRefreshToken({ userId }: IAuthServiceGetRefreshToken): string {
    const payload = { sub: userId, tokenType: 'refresh' };
    return this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET_KEY,
      expiresIn: '14d',
    });
  }

  async OAuthLogin({ socialLoginDto }: IAuthServiceSocialLogin) {
    const { email } = socialLoginDto;
    let user = await this.usersService.findByEmail({ email });

    if (!user) {
      user = await this.usersService.createUser({
        createUserDto: socialLoginDto,
      });
    }

    const accessToken = this.getAccessToken({ userId: user.id });
    const refreshToken = this.getRefreshToken({ userId: user.id });

    return { accessToken, refreshToken };
  }

  refresh({ userId }: IAuthServiceRefresh): string {
    return this.getAccessToken({ userId });
  }
}
