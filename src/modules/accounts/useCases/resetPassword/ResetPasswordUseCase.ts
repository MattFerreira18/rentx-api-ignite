import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '@providers/dateProvider/IDateProvider';
import { IEncryptsProvider } from '@shared/providers/encryptsProviders/IEncryptsProvider';

import { TokenExpired } from '../../errors/TokenExpired';
import { TokenInvalid } from '../../errors/TokenInvalid';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUsersTokensRepository } from '../../repositories/IUsersTokensRepository';

interface IRequest {
  token: string;
  password: string;
}
@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('EncryptsProvider')
    private encryptsProvider: IEncryptsProvider,
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.usersTokensRepository.findByToken(token);

    if (!userToken) {
      throw new TokenInvalid();
    }

    if (this.dateProvider.compareIfBefore(userToken.expiresDate, this.dateProvider.dateNow())) {
      throw new TokenExpired();
    }

    const user = await this.usersRepository.findById(userToken.userId);
    const passwordHash = await this.encryptsProvider.hash(password);

    user.password = passwordHash;

    await this.usersRepository.update(user.id, user);
    await this.usersTokensRepository.remove(userToken.id);
  }
}
