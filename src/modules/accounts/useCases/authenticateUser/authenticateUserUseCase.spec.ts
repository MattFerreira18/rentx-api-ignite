import { AppError } from '@errors/AppError';

import { ICreateUserDTO } from '../../dtos/IUserDTO';
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

describe('Authenticate User', () => {
  let usersRepository: IUsersRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  const data: ICreateUserDTO = {
    name: 'Matheus',
    email: 'matheus@email.com',
    driverLicense: '123456',
    password: '123456789',
  };

  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

    const createUserUseCase = new CreateUserUseCase(usersRepository);

    await createUserUseCase.execute(data);
  });

  it('Should be able to authenticate a user', async () => {
    const auth = await authenticateUserUseCase.execute({
      email: data.email,
      password: data.password,
    });

    expect(auth).toHaveProperty('user');
    expect(auth).toHaveProperty('token');
    expect(auth.user).toHaveProperty('name');
    expect(auth.user).toHaveProperty('email');
  });

  it('Should not be able to authenticate an nonexistent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'email@email.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate a user with incorrect password', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: data.email,
        password: '010101',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
