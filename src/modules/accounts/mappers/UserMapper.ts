import { classToClass } from 'class-transformer';

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
    avatarUrl,
    password,
    createdAt,
  }: User): IListUserDTO {
    const user = classToClass({
      id,
      name,
      email,
      avatar,
      driverLicense,
      isAdmin,
      avatarUrl,
    });

    return user;
  }
}
