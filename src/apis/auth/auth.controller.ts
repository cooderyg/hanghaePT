import {
  User,
  SocialUserAfterAuth,
  UserAfterAuth,
} from './../../commons/decorators/user.decorator';
import { Controller, Post, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { KakaoAuthGuard, RefreshAuthGuard } from './guard/auth.guard';
import { AuthService } from './auth.service';
import { MessageResDto } from 'src/commons/dto/message-res.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(KakaoAuthGuard)
  @Get('/login/kakao')
  async kakaoCallback(
    @User() socialUser: SocialUserAfterAuth,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.OAuthLogin({
      socialLoginDto: socialUser,
    });

    res.cookie('refreshToken', refreshToken);
    res.cookie('accessToken', accessToken);

    res.redirect('/');
  }

  @UseGuards(RefreshAuthGuard)
  @Get('/refresh')
  async refresh(
    @User() user: UserAfterAuth,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MessageResDto> {
    const accessToken = this.authService.refresh({
      userId: user.id,
    });

    res.cookie('accessToken', accessToken);
    return { message: 'refresh' };
  }
}
