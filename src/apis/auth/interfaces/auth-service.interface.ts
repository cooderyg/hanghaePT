import { SocialLoginDto } from '../dto/login.dto';

export interface IAuthServiceSocialLogin {
  socialLoginDto: SocialLoginDto;
}

export interface IAuthServiceGetAccessToken {
  userId: string;
}

export interface IAuthServiceGetRefreshToken {
  userId: string;
}

export interface IAuthServiceRefresh {
  userId: string;
}
