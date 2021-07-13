import { ICreateUserDTO } from '../dtos/IUserDTO';
import User from '../infra/database/entities/User';

interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<void>;
  update(id: string, user: User): Promise<void>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  listAll(): Promise<User[]>;
}

export { IUsersRepository };
