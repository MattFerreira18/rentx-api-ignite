import { NextFunction, Request, Response } from 'express';

import { AppError } from '@errors/AppError';
import { UsersRepository } from '@modules/accounts/infra/database/repositories/UsersRepository';
import { UsersTokensRepository } from '@src/modules/accounts/infra/database/repositories/UsersTokensRepository';
import { TokenProvider } from '@src/shared/providers/tokenProvider/TokenProvider';

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError({ statusCode: 401, message: 'authorization missing' });
  }

  const [, token] = authorization.split(' ');

  const tokenProvider = new TokenProvider();
  const usersTokensRepository = new UsersTokensRepository();

  try {
    const userId = tokenProvider.encodeHash(token);

    const userToken = await usersTokensRepository.findByUserIdAndRefreshToken(userId, token);

    if (!userToken) {
      throw new AppError({ statusCode: 401, message: 'user token does not exists' });
    }

    req.user = {
      id: userId,
    };

    return next();
  } catch (err) {
    throw new AppError({ statusCode: 401, message: 'invalid token' });
  }
}
