import { inject, injectable } from 'tsyringe';

import { AppError } from '@src/shared/errors/AppError';
import { IDateProvider } from '@src/shared/providers/dateProvider/IDateProvider';
import { ITokenProvider } from '@src/shared/providers/tokenProvider/ITokenProvider';

import { RefreshTokenNotFound } from '../../errors/RefreshTokenNotFound';
import { IUsersTokensRepository } from '../../repositories/IUsersTokensRepository';

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('TokenProvider')
    private tokenProvider: ITokenProvider,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(token: string): Promise<string> {
    const userId = this.tokenProvider.encodeHash(token);

    const refreshToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(
      userId,
      token,
    );

    if (!refreshToken) {
      throw new RefreshTokenNotFound();
    }

    await this.usersTokensRepository.remove(refreshToken.id);

    const newRefreshToken = this.tokenProvider.createHash({
      data: userId,
      isRefreshToken: true,
      expiresIn: '30d',
    });

    const refreshTokenExpiresDate = this.dateProvider.addDays(30);

    await this.usersTokensRepository.create({
      expiresDate: refreshTokenExpiresDate,
      refreshToken: newRefreshToken,
      userId,
    });

    return newRefreshToken;
  }
}
