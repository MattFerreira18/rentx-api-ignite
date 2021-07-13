import { getRepository, Repository } from 'typeorm';

import { ICreateUserDTO } from '../../../dtos/IUserDTO';
import { IUsersRepository } from '../../../repositories/IUsersRepository';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    name,
    email,
    driverLicense,
    password,
  }: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      name,
      email,
      driverLicense,
      password,
    });

    await this.repository.save(user);
  }

  async update(id: string, user: User): Promise<void> {
    await this.repository.update(id, user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ where: { email } });

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });

    return user;
  }

  async listAll(): Promise<User[]> {
    const users = await this.repository.find();

    return users;
  }
}

export { UsersRepository };
