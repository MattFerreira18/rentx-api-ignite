import { mock } from 'jest-mock-extended';

import { IEncryptsProvider } from '@providers/encryptsProviders/IEncryptsProvider';
import { ITokenProvider } from '@providers/tokenProvider/ITokenProvider';
import { IDateProvider } from '@src/shared/providers/dateProvider/IDateProvider';

import { ICreateUserDTO } from '../../dtos/IUserDTO';
import { IncorrectEmailOrPassword } from '../../errors/IncorrectEmailOrPassword';
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '../../repositories/inMemory/UsersTokensRepositoryImMemory';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUsersTokensRepository } from '../../repositories/IUsersTokensRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

describe('Authenticate User', () => {
  let usersRepository: IUsersRepository;
  let usersTokensRepository: IUsersTokensRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  const tokenProviderMock = mock<ITokenProvider>();
  const encryptsProviderMock = mock<IEncryptsProvider>();
  const dateProviderMock = mock<IDateProvider>();
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const data: ICreateUserDTO = {
    name: 'Jeremiah Berry',
    email: 'jeremiah@email.com',
    driverLicense: '643441058070',
    password: '81389536',
  };

  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository,
      usersTokensRepository,
      tokenProviderMock,
      encryptsProviderMock,
      dateProviderMock,
    );

    await usersRepository.create(data);
  });

  it('Should be able to authenticate a user', async () => {
    const user = {
      name: data.name,
      email: data.email,
    };

    encryptsProviderMock.compare.mockResolvedValue(true);
    tokenProviderMock.createHash.mockReturnValue(token);
    dateProviderMock.addDays.mockReturnValue(new Date());

    const auth = await authenticateUserUseCase.execute({
      email: data.email,
      password: data.password,
    });

    expect(auth).toHaveProperty('user');
    expect(auth).toHaveProperty('token');

    expect(auth.token).toEqual(token);
    expect(auth.user).toEqual(user);
  });

  it('Should be save the refresh user token in repository', async () => {
    encryptsProviderMock.compare.mockResolvedValue(true);
    tokenProviderMock.createHash.mockReturnValue(token);
    dateProviderMock.addDays.mockReturnValue(new Date());

    const authData = await authenticateUserUseCase.execute({
      email: data.email,
      password: data.password,
    });

    const user = await usersRepository.findByEmail(data.email);

    const refreshToken = await usersTokensRepository.findByUserIdAndRefreshToken(
      user.id,
      authData.token,
    );

    expect(refreshToken).toHaveProperty('id');
    expect(refreshToken.refreshToken).toEqual(token);
  });

  it('Should be call encrypt provider with correct values', async () => {
    const { password } = await usersRepository.findByEmail(data.email);

    encryptsProviderMock.compare.mockResolvedValue(true);
    tokenProviderMock.createHash.mockReturnValue(token);
    dateProviderMock.addDays.mockReturnValue(new Date());

    await authenticateUserUseCase.execute({
      email: data.email,
      password: data.password,
    });

    expect(encryptsProviderMock.compare).toBeCalledTimes(1);
    expect(encryptsProviderMock.compare).toBeCalledWith(data.password, password);
  });

  it('Should be call token provider with correct values', async () => {
    encryptsProviderMock.compare.mockResolvedValue(true);
    tokenProviderMock.createHash.mockReturnValue(token);
    dateProviderMock.addDays.mockReturnValue(new Date());

    await authenticateUserUseCase.execute({
      email: data.email,
      password: data.password,
    });

    expect(tokenProviderMock.createHash).toBeCalledTimes(2);
  });

  it('Should be call date provider with correct values', async () => {
    encryptsProviderMock.compare.mockResolvedValue(true);
    tokenProviderMock.createHash.mockReturnValue(token);
    dateProviderMock.addDays.mockReturnValue(new Date());

    await authenticateUserUseCase.execute({
      email: data.email,
      password: data.password,
    });

    expect(dateProviderMock.addDays).toBeCalledTimes(1);
    expect(dateProviderMock.addDays).toBeCalledWith(30);
  });

  it('Should not be able to authenticate an nonexistent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'lokolsag@zif.bf',
        password: '27543991',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPassword);
  });

  it('Should not be able to authenticate a user with incorrect password', () => {
    encryptsProviderMock.compare.mockResolvedValue(false);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: data.email,
        password: '49995551',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPassword);
  });
});
