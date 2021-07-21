import { inject, injectable } from 'tsyringe';

import { IListUserDTO } from '../../dtos/IUserDTO';
import { UserMapper } from '../../mappers/UserMapper';
import { IUsersRepository } from '../../repositories/IUsersRepository';

@injectable()
export class ProfileUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(userId: string): Promise<IListUserDTO> {
    const user = await this.usersRepository.findById(userId);

    return UserMapper.toDTO(user);
  }
}
