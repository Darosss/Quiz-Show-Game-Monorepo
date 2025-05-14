import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './decorators';
import { JWT_SECRET } from 'src/configs';
import { Request } from 'express';
import { ACCESS_TOKEN_NAME } from './utils';

const UNAUTHORIZED_ERROR_MESSAGE = 'You need to log in to perform this action';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const contextHTTP = context.switchToHttp();
    const request = contextHTTP.getRequest<Request>();
    const accessToken = this.getAccessToken(request);

    if (!accessToken) throw new UnauthorizedException('No token');
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: JWT_SECRET,
      });
      request['user'] = payload;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          `${err.message} expired at: ${err.expiredAt.toUTCString()}`,
        );
      }

      throw new UnauthorizedException(UNAUTHORIZED_ERROR_MESSAGE);
    }
    return true;
  }

  private getAccessToken(request: Request): string | undefined {
    const token =
      request.cookies[ACCESS_TOKEN_NAME] || (request as any).accessToken;
    return token;
  }
}
