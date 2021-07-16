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

  async findByUserIdAndRefreshToken(userId: string, refreshToken: string): Promise<UserTokens> {
    return this.repository
      .createQueryBuilder()
      .where('user_id = :userId', { userId })
      .andWhere('refresh_token = :refreshToken', { refreshToken })
      .getOne();
  }

  async findByToken(token: string): Promise<UserTokens> {
    return this.repository
      .createQueryBuilder()
      .where('refresh_token = :token', { token })
      .getOne();
  }

  async remove(id: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(UserTokens)
      .where('id = :id', { id })
      .execute();
  }
}
