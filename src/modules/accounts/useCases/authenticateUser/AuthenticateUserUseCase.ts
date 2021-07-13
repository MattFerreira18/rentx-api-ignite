import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError({
        statusCode: 403,
        message: 'incorrect email or password',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError({
        statusCode: 403,
        message: 'incorrect email or password',
      });
    }

    // payload - secret phrase (md5) - options
    const token = jwt.sign({}, process.env.SECRET_KEY, {
      subject: user.id,
      expiresIn: '1d',
    });

    return { user: { name: user.name, email: user.email }, token };
  }
}

export { AuthenticateUserUseCase };
