import { inject, injectable } from 'tsyringe';

import { IListUserDTO } from '../../dtos/IUserDTO';
import { UserMapper } from '../../mappers/UserMapper';
import { IUsersRepository } from '../../repositories/IUsersRepository';

@injectable()
class ListAllUsersUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(): Promise<IListUserDTO[]> {
    const users = await this.usersRepository.listAll();

    const clrUsers: IListUserDTO[] = [];

    users.forEach((user) => {
      clrUsers.push(UserMapper.toDTO(user));
    });

    return clrUsers;
  }
}

export { ListAllUsersUseCase };
