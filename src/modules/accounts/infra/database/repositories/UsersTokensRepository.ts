import { getRepository, Repository } from 'typeorm';

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/IUserTokenDTO';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';

import { UserTokens } from '../entities/UserTokens';

export class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async create({
    userId,
    refreshToken,
    expiresDate,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      userId,
      refreshToken,
      expiresDate,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserId(userId: string): Promise<UserTokens[]> {
    return this.repository
      .createQueryBuilder()
      .where('user_id = :userId', { userId })
      .getMany();
  }
}
