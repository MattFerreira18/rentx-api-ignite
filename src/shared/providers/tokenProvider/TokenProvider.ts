import jwt from 'jsonwebtoken';

import { AppError } from '@src/shared/errors/AppError';

import { ITokenProvider } from './ITokenProvider';

interface ITokenPayload {
  iat: string;
  exp: string;
  sub: string;
}

export class TokenProvider implements ITokenProvider {
  createHash(data: string, expiresIn?: string): string {
    const token = jwt.sign({ sub: data }, process.env.SECRET_KEY, {
      expiresIn: expiresIn ?? '1d',
    });

    return token;
  }

  encodeHash(token: string): string {
    try {
      const { sub } = jwt.verify(token, process.env.SECRET_KEY) as ITokenPayload;

      return sub;
    } catch (err) {
      throw new AppError({ statusCode: 409, message: 'invalid token' });
    }
  }
}
