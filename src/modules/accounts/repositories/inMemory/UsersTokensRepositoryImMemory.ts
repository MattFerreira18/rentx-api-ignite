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

  async findByUserId(userId: string): Promise<UserTokens[]> {
    return this.repository.filter((token) => token.userId === userId);
  }
}
