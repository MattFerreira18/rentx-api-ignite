import { mock } from 'jest-mock-extended';

import { IDateProvider } from '@src/shared/providers/dateProvider/IDateProvider';
import { IEncryptsProvider } from '@src/shared/providers/encryptsProviders/IEncryptsProvider';

import { ICreateUserDTO } from '../../dtos/IUserDTO';
import { TokenExpired } from '../../errors/TokenExpired';
import { TokenInvalid } from '../../errors/TokenInvalid';
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '../../repositories/inMemory/UsersTokensRepositoryImMemory';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUsersTokensRepository } from '../../repositories/IUsersTokensRepository';
import { ResetPasswordUseCase } from './ResetPasswordUseCase';

describe('reset password use case', () => {
  let usersRepository: IUsersRepository;
  let usersTokensRepository: IUsersTokensRepository;
  let resetPasswordUseCase: ResetPasswordUseCase;
  const expiresDate = new Date();

  const dateProviderMock = mock<IDateProvider>();
  const encryptsProviderMock = mock<IEncryptsProvider>();
  const token = '163997787588029836053423';
  const data: ICreateUserDTO = {
    name: 'Max Cohen',
    email: 'max@email.com',
    driverLicense: '347333179552',
    password: '04775536',
  };

  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    resetPasswordUseCase = new ResetPasswordUseCase(
      usersRepository,
      usersTokensRepository,
      dateProviderMock,
      encryptsProviderMock,
    );

    await usersRepository.create(data);

    const user = await usersRepository.findByEmail(data.email);

    await usersTokensRepository.create({
      userId: user.id,
      expiresDate,
      refreshToken: token,
    });
  });

  it('Should be able to reset user password', async () => {
    const password = '26470739';
    const passwordHash = '062714279132';

    dateProviderMock.compareIfBefore.mockReturnValue(false);
    dateProviderMock.dateNow.mockReturnValue(new Date());
    encryptsProviderMock.hash.mockResolvedValue(passwordHash);

    await resetPasswordUseCase.execute({ token, password });

    const user = await usersRepository.findByEmail(data.email);

    expect(user.password).toEqual(passwordHash);
  });

  it('Should be call date provider with correct values', async () => {
    const password = '26470739';
    const dateNow = new Date();

    dateProviderMock.compareIfBefore.mockReturnValue(false);
    dateProviderMock.dateNow.mockReturnValue(dateNow);
    encryptsProviderMock.hash.mockResolvedValue(password);

    await resetPasswordUseCase.execute({ token, password });

    expect(dateProviderMock.compareIfBefore).toBeCalledTimes(1);
    expect(dateProviderMock.compareIfBefore).toBeCalledWith(expiresDate, dateNow);

    expect(dateProviderMock.dateNow).toBeCalledTimes(1);
  });

  it('Should be call encrypts provider with correct values', async () => {
    const password = '26470739';

    dateProviderMock.compareIfBefore.mockReturnValue(false);
    dateProviderMock.dateNow.mockReturnValue(new Date());
    encryptsProviderMock.hash.mockResolvedValue(password);

    await resetPasswordUseCase.execute({ token, password });

    expect(encryptsProviderMock.hash).toBeCalledTimes(1);
    expect(encryptsProviderMock.hash).toBeCalledWith(password);
  });

  it('Should not be able to reset user password with a nonexisting token', () => {
    expect(async () => {
      await resetPasswordUseCase.execute({
        token: '996035698060790321144953',
        password: '48984707',
      });
    }).rejects.toBeInstanceOf(TokenInvalid);
  });

  it('Should not be able to reset user password with a token expired', () => {
    dateProviderMock.compareIfBefore.mockReturnValue(true);

    expect(async () => {
      await resetPasswordUseCase.execute({ token, password: '48984707' });
    }).rejects.toBeInstanceOf(TokenExpired);
  });
});
