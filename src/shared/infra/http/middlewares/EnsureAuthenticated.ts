import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AppError } from '@errors/AppError';
import { UsersRepository } from '@modules/accounts/infra/database/repositories/UsersRepository';

interface IPayload {
  iat: string;
  exp: string;
  sub: string;
}

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

  try {
    const { sub: userId } = jwt.verify(token, 'ooifhhsogh') as IPayload;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError({ statusCode: 401, message: 'user does not exists' });
    }

    req.user = {
      id: userId,
    };

    return next();
  } catch (err) {
    throw new AppError({ statusCode: 401, message: 'invalid token' });
  }
}

// @injectable()
// class EnsureAuthenticated {
//   constructor(
//     @inject('UsersRepository')
//     private usersRepository: IUsersRepository
//   ) {}

//   async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
//     const { authorization } = req.headers;

//     if (!authorization) {
//       throw new Error('authorization not found');
//     }

//     const [, token] = authorization.split(' ');

//     try {
//       const { sub: userId } = jwt.verify(token, 'ooifhhsogh') as IPayload;
//       console.log(userId);
//       // const usersRepository = new UsersRepository();

//       const user = await this.usersRepository.findById(userId);
//       console.log(user);
//       if (!user) {
//         throw new Error('user does not exists');
//       }

//       // req.userId = userId;

//       next();
//     } catch (err) {
//       throw new Error('invalid token');
//     }
//   }
// }

// const ensureAuthenticated = container.resolve(EnsureAuthenticated);

// export { ensureAuthenticated };
