import { inject, injectable } from 'tsyringe';

import User from '../../infra/database/entities/User';
import { IUsersRepository } from '../../repositories/IUsersRepository';

// interface IUserWithoutPassword {
//   id: string;
//   name: string;
//   email: string;
//   driverLicense: string;
//   isAdmin: boolean;
//   createdAt: Date;
// }

@injectable()
class ListAllUsersUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(): Promise<User[]> {
    const users = await this.usersRepository.listAll();

    return users;
  }
}

export { ListAllUsersUseCase };
