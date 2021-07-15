import { ICreateUserTokenDTO } from '../../dtos/IUserTokenDTO';
import { UserTokens } from '../../infra/database/entities/UserTokens';
import { IUsersTokensRepository } from '../IUsersTokensRepository';

export class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  repository: UserTokens[] = [];

  async create(data: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, data);

    this.repository.push(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(userId: string, refreshToken: string): Promise<UserTokens> {
    return this.repository
      .find((userToken) => userToken.userId === userId && userToken.refreshToken === refreshToken);
  }

  async remove(id: string): Promise<void> {
    const clrRepo = this.repository.filter((userToken) => userToken.id !== id);

    this.repository = [...clrRepo];
  }
}
