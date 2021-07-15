import jwt from 'jsonwebtoken';

import authConfig from '@configs/auth';
import { AppError } from '@src/shared/errors/AppError';

import { ITokenProvider } from './ITokenProvider';

interface ITokenPayload {
  iat: string;
  exp: string;
  sub: string;
}

export class TokenProvider implements ITokenProvider {
  createHash(data: string, expiresIn?: string): string {
    const token = jwt.sign({ sub: data ?? authConfig.public_token }, authConfig.secret_token, {
      expiresIn: expiresIn ?? '15m',
    });

    return token;
  }

  encodeHash(token: string): string {
    try {
      const { sub } = jwt.verify(token, authConfig.secret_token) as unknown as ITokenPayload;

      return sub;
    } catch (err) {
      throw new AppError({ statusCode: 409, message: 'invalid token' });
    }
  }
}
