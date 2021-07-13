export interface IEncryptsProvider {
  hash(data: string): Promise<string>;
  compare(data: string, hash: string): Promise<boolean>;
}
