import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users';
import { comparHashedString } from './auth.helpers';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/users/schemas/user.schema';
import { UserTokenInfo, addSecondsToDate } from 'src/shared';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from './refresh-token-service';

export type SignInReturnType = {
  accessToken: string;
  refreshToken: string;
  expTimestamp: number;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async registerUser(createUserDto: RegisterDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  async signIn(username: string, password: string): Promise<SignInReturnType> {
    const user = await this.usersService.findOne({ username }, {});

    if (!user) {
      throw new UnauthorizedException(
        'Account with that username does not exist',
      );
    }

    if (!(await comparHashedString(password, user.password))) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = {
      sub: user._id,
      username: user.username,
      roles: user.roles,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.refreshTokenService.signAsync(payload),
      expTimestamp: addSecondsToDate(
        Number(process.env.ACCESS_TOKEN_EXPIRATION_MS) / 1000,
      ).getTime(),
    };
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const decodedToken = this.jwtService.verify(token);
      return !!decodedToken;
    } catch (error) {
      return false;
    }
  }

  async decodeRefreshToken(token: string): Promise<UserTokenInfo | null> {
    try {
      const decodedToken = this.refreshTokenService.verify(
        token,
      ) as UserTokenInfo | null;
      return decodedToken;
    } catch (error) {
      return null;
    }
  }

  async refreshToken(payload: UserTokenInfo): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...restPayload } = payload;
    const newToken = await this.jwtService.signAsync(restPayload);
    return newToken;
  }

  async extractUserInfoFromToken(token: string): Promise<UserTokenInfo> {
    return await this.jwtService.decode(token);
  }
}
