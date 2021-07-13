import { NextFunction, Request, Response } from 'express';

import { AppError } from '@errors/AppError';
import { UsersRepository } from '@modules/accounts/infra/database/repositories/UsersRepository';

export const ensureAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.user;

  const usersRepository = new UsersRepository();

  const user = await usersRepository.findById(id);

  if (!user.isAdmin) {
    throw new AppError({ statusCode: 401, message: 'user is not admin' });
  }

  return next();
};
