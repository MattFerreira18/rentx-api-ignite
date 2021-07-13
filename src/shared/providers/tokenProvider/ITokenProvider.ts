export interface ITokenProvider {
  createHash(data: string, expiresIn?: string): string;
  encodeHash(token: string): string;
}
