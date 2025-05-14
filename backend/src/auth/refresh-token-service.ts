import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { UserTokenInfo } from 'src/shared';

@Injectable()
export class RefreshTokenService {
  private jwt: JwtService;
  private secret: string;
  private expiresIn: number;

  constructor(private configService: ConfigService) {
    this.secret = this.configService.get('REFRESH_TOKEN_SECRET');
    this.expiresIn = ms(
      `${this.configService.get('REFRESH_TOKEN_EXPIRATION_MS') || '7d'} `,
    );

    this.jwt = new JwtService({
      secret: this.secret,
      signOptions: { expiresIn: this.expiresIn },
    });
  }

  async signAsync(payload: any) {
    return this.jwt.signAsync(payload);
  }

  verify(token: string) {
    return this.jwt.verify(token, {
      secret: this.secret,
    });
  }
  decode(token: string): UserTokenInfo {
    return this.jwt.decode<UserTokenInfo>(token);
  }
}
