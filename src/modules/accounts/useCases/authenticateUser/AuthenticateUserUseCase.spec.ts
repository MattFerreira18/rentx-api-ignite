import { mock } from 'jest-mock-extended';

import { IEncryptsProvider } from '@providers/encryptsProviders/IEncryptsProvider';
import { ITokenProvider } from '@providers/tokenProvider/ITokenProvider';

import { ICreateUserDTO } from '../../dtos/IUserDTO';
import { IncorrectEmailOrPassword } from '../../errors/IncorrectEmailOrPassword';
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

describe('Authenticate User', () => {
  let usersRepository: IUsersRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  const tokenProviderMock = mock<ITokenProvider>();
  const encryptsProviderMock = mock<IEncryptsProvider>();
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const data: ICreateUserDTO = {
    name: 'Matheus',
    email: 'matheus@email.com',
    driverLicense: '123456',
    password: '123456789',
  };

  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository,
      tokenProviderMock,
      encryptsProviderMock,
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

    const auth = await authenticateUserUseCase.execute({
      email: data.email,
      password: data.password,
    });

    expect(auth).toHaveProperty('user');
    expect(auth).toHaveProperty('token');

    expect(auth.token).toEqual(token);
    expect(auth.user).toEqual(user);
  });

  it('Should be call encrypt provider with correct values', async () => {
    const { password } = await usersRepository.findByEmail(data.email);

    encryptsProviderMock.compare.mockResolvedValue(true);
    tokenProviderMock.createHash.mockReturnValue(token);

    await authenticateUserUseCase.execute({
      email: data.email,
      password: data.password,
    });

    expect(encryptsProviderMock.compare).toBeCalledTimes(1);
    expect(encryptsProviderMock.compare).toBeCalledWith(data.password, password);
  });

  it('Should be call token provider with correct values', async () => {
    const { id } = await usersRepository.findByEmail(data.email);

    encryptsProviderMock.compare.mockResolvedValue(true);
    tokenProviderMock.createHash.mockReturnValue(token);

    await authenticateUserUseCase.execute({
      email: data.email,
      password: data.password,
    });

    expect(tokenProviderMock.createHash).toBeCalledTimes(1);
    expect(tokenProviderMock.createHash).toBeCalledWith(id);
  });

  it('Should not be able to authenticate an nonexistent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'email@email.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPassword);
  });

  it('Should not be able to authenticate a user with incorrect password', () => {
    encryptsProviderMock.compare.mockResolvedValue(false);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: data.email,
        password: '010101',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPassword);
  });
});
