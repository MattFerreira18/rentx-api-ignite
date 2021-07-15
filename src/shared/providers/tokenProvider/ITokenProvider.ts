export interface ICreateToken {
  data: string;
  isRefreshToken: boolean,
  expiresIn?: string;
}

export interface ITokenProvider {
  createHash(data: ICreateToken): string;
  encodeHash(token: string): string;
}
