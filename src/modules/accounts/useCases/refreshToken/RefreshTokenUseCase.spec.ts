import { mock } from 'jest-mock-extended';

import { IDateProvider } from '@providers/dateProvider/IDateProvider';
import { ITokenProvider } from '@providers/tokenProvider/ITokenProvider';

import { RefreshTokenNotFound } from '../../errors/RefreshTokenNotFound';
import { UsersTokensRepositoryInMemory } from '../../repositories/inMemory/UsersTokensRepositoryImMemory';
import { IUsersTokensRepository } from '../../repositories/IUsersTokensRepository';
import { RefreshTokenUseCase } from './RefreshTokenUseCase';

describe('refresh token use case', () => {
  let usersTokensRepository: IUsersTokensRepository;
  let refreshTokenUseCase: RefreshTokenUseCase;

  const tokenProviderMock = mock<ITokenProvider>();
  const dateProviderMock = mock<IDateProvider>();
  const token = 'bc7b8bf12b95a8dc8c34deef98e8c955d6bd60e74a56817f8accb43d445aa540';
  const secondToken = '00bc7b8bf12bdgda8dc8c34deef98e8c955d6bd60e74a56817f8accb43d445aa540';
  const userId = '6ccb21214ffd60b0fc2c1607cf6a05be6a0fed9c74819eb6a92e1bd6717b28eb';

  beforeEach(() => {
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    refreshTokenUseCase = new RefreshTokenUseCase(
      usersTokensRepository,
      tokenProviderMock,
      dateProviderMock,
    );

    usersTokensRepository.create({
      expiresDate: new Date(),
      refreshToken: token,
      userId,
    });
  });

  it('Should be able to create a new refresh token', async () => {
    tokenProviderMock.createHash.mockReturnValue(secondToken);
    tokenProviderMock.encodeHash.mockReturnValue(userId);
    dateProviderMock.addDays.mockReturnValue(new Date());

    const newToken = await refreshTokenUseCase.execute(token);
    const refreshToken = await usersTokensRepository.findByUserIdAndRefreshToken(userId, newToken);

    expect(newToken).toEqual(secondToken);
    expect(refreshToken).toHaveProperty('id');
  });

  it('Should be call the token provider with correct values', async () => {
    tokenProviderMock.createHash.mockReturnValue(secondToken);
    tokenProviderMock.encodeHash.mockReturnValue(userId);
    dateProviderMock.addDays.mockReturnValue(new Date());

    await refreshTokenUseCase.execute(token);

    expect(tokenProviderMock.createHash).toBeCalledTimes(1);
    expect(tokenProviderMock.createHash).toBeCalledWith({
      data: userId,
      isRefreshToken: true,
      expiresIn: '30d',
    });

    expect(tokenProviderMock.encodeHash).toBeCalledTimes(1);
    expect(tokenProviderMock.encodeHash).toBeCalledWith(token);
  });

  it('Should be call the date provider with correct value', async () => {
    tokenProviderMock.createHash.mockReturnValue(secondToken);
    tokenProviderMock.encodeHash.mockReturnValue(userId);
    dateProviderMock.addDays.mockReturnValue(new Date());

    await refreshTokenUseCase.execute(token);

    expect(dateProviderMock.addDays).toBeCalledTimes(1);
    expect(dateProviderMock.addDays).toBeCalledWith(30);
  });

  it('Should not be able to create a new refresh token with a nonexisting token', () => {
    expect(async () => {
      await refreshTokenUseCase.execute('token');
    }).rejects.toBeInstanceOf(RefreshTokenNotFound);
  });
});
