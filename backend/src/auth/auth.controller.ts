import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  Res,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { AuthService, SignInReturnType } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators';
import { RegisterDto } from './dto/register.dto';
import { ControllerResponseReturn } from 'src/types';
import { User } from 'src/users';
import { UserTokenInfo } from 'src/shared';
import { Response, Request as ExpressRequest } from 'express';
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  setAccessTokenCookieData,
  setRefreshTokenCookieData,
} from './utils';

type StatusResponseType = {
  authenticated: boolean;
  tokenInfo?: UserTokenInfo;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(
    @Body() signInDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ControllerResponseReturn<Pick<SignInReturnType, 'expTimestamp'>>> {
    const tokenData = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    setAccessTokenCookieData(res, tokenData.accessToken);
    setRefreshTokenCookieData(res, tokenData.refreshToken);

    return {
      data: {
        expTimestamp: tokenData.expTimestamp,
      },
      message: 'Successfully logged in',
    };
  }

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ControllerResponseReturn<User>> {
    return {
      data: await this.authService.registerUser(registerDto),
      message: 'Successfully registered',
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_TOKEN_NAME);
    res.clearCookie(REFRESH_TOKEN_NAME);
    return { message: 'Logged out' };
  }

  @Get('profile')
  async getProfile(
    @Request() req,
  ): Promise<ControllerResponseReturn<UserTokenInfo>> {
    return { data: req.user };
  }

  @Public()
  @Get('status')
  async checkAuthStatus(
    @Headers('Authorization') token: string,
  ): Promise<StatusResponseType> {
    if (!token) {
      return { authenticated: false };
    }

    const onlyToken = token.split(' ').at(1);
    const isValidToken = await this.authService.verifyToken(onlyToken);
    if (isValidToken) {
      const user = await this.authService.extractUserInfoFromToken(onlyToken);
      return { authenticated: true, tokenInfo: user };
    } else {
      return { authenticated: false };
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[REFRESH_TOKEN_NAME];
    if (!token) throw new UnauthorizedException('No refresh token');

    try {
      const payload = await this.authService.decodeRefreshToken(token);

      if (!payload) throw new UnauthorizedException('Invalid refresh token');

      const newAccessToken = await this.authService.refreshToken(payload);
      setAccessTokenCookieData(res, newAccessToken);

      return { message: 'Refreshed access token' };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
