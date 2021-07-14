import { mock } from 'jest-mock-extended';

import { IEncryptsProvider } from '@providers/encryptsProviders/IEncryptsProvider';

import { ICreateUserDTO } from '../../dtos/IUserDTO';
import { UserAlreadyExists } from '../../errors/UserAlreadyExists';
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';

describe('create user use case', () => {
  let usersRepository: IUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  const encryptsProviderMock = mock<IEncryptsProvider>();
  const data: ICreateUserDTO = {
    name: 'Matheus',
    email: 'matheus@email.com',
    driverLicense: '123456',
    password: '123456789',
  };

  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(
      usersRepository,
      encryptsProviderMock,
    );
  });

  it('Should be able to create a user', async () => {
    encryptsProviderMock.hash.mockResolvedValue('passwordHashed');

    await createUserUseCase.execute(data);

    const user = await usersRepository.findByEmail(data.email);

    expect(user).toHaveProperty('id');
    expect(user.password).toEqual('passwordHashed');
  });

  it('Should be call encrypt provider with correct value', async () => {
    encryptsProviderMock.hash.mockResolvedValueOnce('passwordHashed');

    await createUserUseCase.execute(data);

    expect(encryptsProviderMock.hash).toBeCalledTimes(1);
    expect(encryptsProviderMock.hash).toBeCalledWith(data.password);
  });

  it('Should not be able to create a user with existing email', async () => {
    await createUserUseCase.execute(data);

    expect(async () => {
      await createUserUseCase.execute(data);
    }).rejects.toBeInstanceOf(UserAlreadyExists);
  });
});
