import { v4 as uuid } from 'uuid';

import { UserNotFound } from '../../errors/UserNotFound';
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

describe('update user avatar use case', () => {
  let usersRepository: IUsersRepository;
  let updateUserAvatarUseCase: UpdateUserAvatarUseCase;
  let userId: string;

  const avatarFile = 'avatar file';

  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(usersRepository);

    await usersRepository.create({
      name: 'Dora Hines',
      email: 'dora@email.com',
      driverLicense: '123456',
      password: '123456789',
    });

    const user = await usersRepository.findByEmail('dora@email.com');

    userId = user.id;
  });

  it('Should be able to update the avatar of a user', async () => {
    await updateUserAvatarUseCase.execute({ userId, avatarFile });

    const user = await usersRepository.findByEmail('dora@email.com');

    expect(user.avatar).toEqual(avatarFile);
  });

  it('Should not be able to update the avatar of a nonexisting user', () => {
    expect(async () => {
      await updateUserAvatarUseCase.execute({ userId: uuid(), avatarFile });
    }).rejects.toBeInstanceOf(UserNotFound);
  });
});
