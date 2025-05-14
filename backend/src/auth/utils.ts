import { Response } from 'express';

export const ACCESS_TOKEN_NAME = 'access_token_qs';
export const REFRESH_TOKEN_NAME = 'refresh_token_qs';

export const setAccessTokenCookieData = (res: Response, newToken: string) => {
  res.cookie(ACCESS_TOKEN_NAME, newToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: Number(process.env.ACCESS_TOKEN_EXPIRATION_MS) || 60 * 60 * 1000,
  });
};
export const setRefreshTokenCookieData = (res: Response, newToken: string) => {
  res.cookie(REFRESH_TOKEN_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:
      Number(process.env.REFRESH_TOKEN_EXPIRATION_MS) ||
      7 * 24 * 60 * 60 * 1000,
  });
};
