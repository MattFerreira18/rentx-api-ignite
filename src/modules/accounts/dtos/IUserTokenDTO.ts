export interface ICreateUserTokenDTO {
  userId: string;
  refreshToken: string;
  expiresDate: Date;
}
