import { inject, injectable } from 'tsyringe';

import { IStorageProvider } from '@providers/StorageProvider/IStorageProvider';

import { UserNotFound } from '../../errors/UserNotFound';
import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
  userId: string;
  avatarFile: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute({ userId, avatarFile }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UserNotFound();
    }

    if (user.avatar) {
      await this.storageProvider.remove(user.avatar, 'avatar');
    }

    await this.storageProvider.save(avatarFile, 'avatar');

    user.avatar = avatarFile;

    await this.usersRepository.update(user.id, user);
  }
}

export { UpdateUserAvatarUseCase };
