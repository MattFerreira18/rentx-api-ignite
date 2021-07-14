import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

import { deleteFile } from '../../../../utils/file';
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
  ) {}

  async execute({ userId, avatarFile }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError({ statusCode: 404, message: 'user not found' });
    }

    if (user.avatar) {
      await deleteFile(`./tmp/avatar/${user.avatar}`);
    }

    user.avatar = avatarFile;

    await this.usersRepository.update(user.id, user);
  }
}

export { UpdateUserAvatarUseCase };
