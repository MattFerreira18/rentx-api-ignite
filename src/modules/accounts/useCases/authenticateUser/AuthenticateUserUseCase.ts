import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IEncryptsProvider } from '@providers/encryptsProviders/IEncryptsProvider';
import { ITokenProvider } from '@providers/tokenProvider/ITokenProvider';

import { IncorrectEmailOrPassword } from '../../errors/IncorrectEmailOrPassword';
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
    @inject('TokenProvider')
    private tokenProvider: ITokenProvider,
    @inject('EncryptsProvider')
    private encryptsProvider: IEncryptsProvider,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new IncorrectEmailOrPassword();
    }

    const passwordMatch = await this.encryptsProvider.compare(password, user.password);

    if (!passwordMatch) {
      throw new IncorrectEmailOrPassword();
    }

    const token = this.tokenProvider.createHash(user.id);

    return { user: { name: user.name, email: user.email }, token };
  }
}

export { AuthenticateUserUseCase };
