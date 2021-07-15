import { ICreateUserTokenDTO } from '../dtos/IUserTokenDTO';
import { UserTokens } from '../infra/database/entities/UserTokens';

export interface IUsersTokensRepository {
  create(data: ICreateUserTokenDTO): Promise<UserTokens>;
  findByUserIdAndRefreshToken(userId: string, refreshToken: string): Promise<UserTokens>;
  remove(id: string): Promise<void>;
}
