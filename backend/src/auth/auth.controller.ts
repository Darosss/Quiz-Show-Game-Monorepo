import { Body, Controller, Get, Request, Post, Headers } from '@nestjs/common';
import { AuthService, SignInReturnType } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators';
import { RegisterDto } from './dto/register.dto';
import { ControllerResponseReturn } from 'src/types';
import { User } from 'src/users';
import { UserTokenInfo } from 'src/shared';

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
  ): Promise<ControllerResponseReturn<SignInReturnType>> {
    return {
      data: await this.authService.signIn(
        signInDto.username,
        signInDto.password,
      ),
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
}
