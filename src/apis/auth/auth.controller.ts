import {
  SocialUser,
  SocialUserAfterAuth,
} from './../../commons/decorators/user.decorator';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { KakaoAuthGuard } from './guard/auth.guard';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(KakaoAuthGuard)
  @Get('/login/kakao')
  async kakaoCallback(
    @SocialUser() socialUser: SocialUserAfterAuth,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.OAuthLogin({
      socialLoginDto: socialUser,
    });

    res.cookie('refreshToken', refreshToken);
    res.cookie('accessToken', accessToken);

    res.redirect('/');
  }
}
