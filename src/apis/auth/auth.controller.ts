import {
  User,
  SocialUserAfterAuth,
  UserAfterAuth,
} from './../../commons/decorators/user.decorator';
import { Controller, Post, Get, Res, UseGuards, Body } from '@nestjs/common';
import { Response } from 'express';
import {
  AccessAuthGuard,
  KakaoAuthGuard,
  RefreshAuthGuard,
} from './guard/auth.guard';
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
  ) {
    const accessToken = this.authService.refresh({
      userId: user.id,
    });
    //Todo: 개발완료 시 cookie부분 삭제
    res.cookie('accessToken', accessToken);
    return { accessToken };
  }

  @Post('login')
  async login(@Body() loginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login({
      loginDto,
    });
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken);
    //Todo: 개발완료 시 cookie부분 삭제
    return { accessToken, refreshToken };
  }
}
