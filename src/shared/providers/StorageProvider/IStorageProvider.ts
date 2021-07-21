export interface IStorageProvider {
  save(file: string, folder: string): Promise<string>;
  remove(file: string, folder: string): Promise<void>;
}
