import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  setAccessTokenCookieData,
} from './utils';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies[ACCESS_TOKEN_NAME];
    const refreshToken = req.cookies[REFRESH_TOKEN_NAME];
    if (!accessToken && refreshToken) {
      try {
        const payload = await this.authService.decodeRefreshToken(refreshToken);
        const newToken = await this.authService.refreshToken(payload);

        setAccessTokenCookieData(res, newToken);

        (req as any).accessToken = newToken;
        return next();
      } catch {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }

    if (accessToken) {
      try {
        this.authService.verifyToken(accessToken);
        return next();
      } catch (err) {
        if (err.name === 'TokenExpiredError' && refreshToken) {
          try {
            const newToken = await this.authService.refreshToken(refreshToken);
            res.cookie(ACCESS_TOKEN_NAME, newToken, {
              httpOnly: true,
              sameSite: 'strict',
              secure: process.env.NODE_ENV === 'production',
            });

            (req as any).accessToken = newToken;
            return next();
          } catch {
            throw new UnauthorizedException('Invalid refresh token');
          }
        }

        throw new UnauthorizedException();
      }
    }

    return next();
  }
}
