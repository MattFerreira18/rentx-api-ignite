import { ICreateUserTokenDTO } from '../dtos/IUserTokenDTO';
import { UserTokens } from '../infra/database/entities/UserTokens';

export interface IUsersTokensRepository {
  create(data: ICreateUserTokenDTO): Promise<UserTokens>;
  findByUserId(userId: string): Promise<UserTokens[]>;
}
