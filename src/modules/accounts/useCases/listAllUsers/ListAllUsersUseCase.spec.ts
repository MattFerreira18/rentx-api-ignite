import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { ListAllUsersUseCase } from './ListAllUsersUseCase';

describe('list all users use case', () => {
  let usersRepository: IUsersRepository;
  let listAllUsersUseCase: ListAllUsersUseCase;

  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    listAllUsersUseCase = new ListAllUsersUseCase(usersRepository);

    usersRepository.create({
      name: 'Kyle Glover',
      email: 'kyle@email.com',
      driverLicense: '123456',
      password: '123456789',
    });

    usersRepository.create({
      name: 'Anna',
      email: 'ana@email.com',
      driverLicense: '456789',
      password: '123456789',
    });

    usersRepository.create({
      name: 'Allie Conner',
      email: 'allie@email.com',
      driverLicense: '5184809',
      password: '123456789',
    });
  });

  it('Should be able to list all users', async () => {
    const users = await listAllUsersUseCase.execute();

    expect(users).toHaveLength(3);
  });

  it('Should not be able to list all users with yours password', async () => {
    const users = await listAllUsersUseCase.execute();

    expect(users[0]).not.toHaveProperty('password');
  });
});
