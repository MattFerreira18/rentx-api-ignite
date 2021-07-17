import { NextFunction, Request, Response } from 'express';

import { AppError } from '@errors/AppError';
import { UsersRepository } from '@modules/accounts/infra/database/repositories/UsersRepository';
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
  const usersRepository = new UsersRepository();
  // const usersTokensRepository = new UsersTokensRepository();
  try {
    const userId = tokenProvider.encodeHash(token);

    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError({ statusCode: 409, message: 'user not found' });
    }

    req.user = {
      id: userId,
    };

    return next();
  } catch (err) {
    throw new AppError({ statusCode: 401, message: 'invalid token' });
  }
}
