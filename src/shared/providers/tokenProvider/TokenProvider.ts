import jwt from 'jsonwebtoken';

import authConfig from '@configs/auth';
import { AppError } from '@src/shared/errors/AppError';

import { ICreateToken, ITokenProvider } from './ITokenProvider';

interface ITokenPayload {
  iat: string;
  exp: string;
  sub: string;
}

export class TokenProvider implements ITokenProvider {
  createHash({ data, isRefreshToken, expiresIn }: ICreateToken): string {
    const token = jwt.sign({ sub: data }, (
      isRefreshToken
        ? authConfig.public_token
        : authConfig.secret_token), {
      expiresIn: expiresIn ?? '15m',
    });

    return token;
  }

  encodeHash(token: string): string {
    try {
      const { sub } = jwt.verify(token, authConfig.public_token) as unknown as ITokenPayload;

      return sub;
    } catch (err) {
      throw new AppError({ statusCode: 409, message: 'invalid token' });
    }
  }
}
