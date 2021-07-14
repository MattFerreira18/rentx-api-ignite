import { IListUserDTO } from '../dtos/IUserDTO';
import User from '../infra/database/entities/User';

export class UserMapper {
  static toDTO({
    id,
    name,
    email,
    avatar,
    isAdmin,
    driverLicense,
    password,
    createdAt,
  }: User): IListUserDTO {
    return {
      id,
      name,
      email,
      driverLicense,
      isAdmin,
    };
  }
}
