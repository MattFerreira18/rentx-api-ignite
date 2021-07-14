import { ICreateUserDTO } from '../../dtos/IUserDTO';
import User from '../../infra/database/entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepositoryInMemory implements IUsersRepository {
  private repository: User[] = [];

  async create(data: ICreateUserDTO): Promise<void> {
    const user = new User();

    Object.assign(user, data);

    this.repository.push(user);
  }
  async update(id: string, user: User): Promise<void> {
    const userIndex = this.repository.findIndex((aUser) => aUser.id === id);

    this.repository[userIndex] = user;
  }
  async findByEmail(email: string): Promise<User> {
    return this.repository.find((user) => user.email === email);
  }
  async findById(id: string): Promise<User> {
    return this.repository.find((user) => user.id === id);
  }
  async listAll(): Promise<User[]> {
    return this.repository;
  }
}
