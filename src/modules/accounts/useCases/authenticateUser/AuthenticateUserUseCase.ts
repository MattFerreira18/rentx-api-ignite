import { inject, injectable } from 'tsyringe';

import { IEncryptsProvider } from '@providers/encryptsProviders/IEncryptsProvider';
import { ITokenProvider } from '@providers/tokenProvider/ITokenProvider';
import { IDateProvider } from '@src/shared/providers/dateProvider/IDateProvider';

import { IncorrectEmailOrPassword } from '../../errors/IncorrectEmailOrPassword';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUsersTokensRepository } from '../../repositories/IUsersTokensRepository';

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
  refreshToken: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('TokenProvider')
    private tokenProvider: ITokenProvider,
    @inject('EncryptsProvider')
    private encryptsProvider: IEncryptsProvider,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
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

    const refreshToken = this.tokenProvider.createHash(email, '30d');

    const refreshTokenExpiresDate = this.dateProvider.addDays(30);

    await this.usersTokensRepository.create({
      expiresDate: refreshTokenExpiresDate,
      refreshToken,
      userId: user.id,
    });

    const token = this.tokenProvider.createHash(user.id);

    return { user: { name: user.name, email: user.email }, token, refreshToken };
  }
}

export { AuthenticateUserUseCase };
