import {
  User,
  SocialUserAfterAuth,
  UserAfterAuth,
} from './../../commons/decorators/user.decorator';
import {
  Controller,
  Post,
  Get,
  Res,
  UseGuards,
  Body,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
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
  ) {
    const { accessToken, refreshToken } = await this.authService.OAuthLogin({
      socialLoginDto: socialUser,
    });

    res.cookie('refreshToken', refreshToken);
    res.cookie('accessToken', accessToken);

    res.redirect('http://localhost:3001');
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
    return { result: true };
  }

  @Post('login')
  async login(@Body() loginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login({
      loginDto,
    });
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken);
    return { accessToken, refreshToken };
  }

  @UseGuards(AccessAuthGuard)
  @Delete('logout')
  async logout(@Res() res: Response, @User() user: UserAfterAuth) {
    if (!user)
      throw new UnauthorizedException('로그아웃 할 수 없는 상태입니다.');
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return { result: true };
  }
}
