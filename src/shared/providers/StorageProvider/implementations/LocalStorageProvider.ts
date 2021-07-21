import fs from 'fs';
import path from 'path';

import upload from '@src/configs/upload';

import { IStorageProvider } from '../IStorageProvider';

export class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(upload.tmpFolder, file),
      path.resolve(`${upload.tmpFolder}/${folder}`, file),
    );

    return file;
  }

  async remove(file: string, folder: string): Promise<void> {
    const filename = path.resolve(`${upload.tmpFolder}/${folder}`, file);

    try {
      await fs.promises.stat(filename); // verify if file exists
    } catch {
      return;
    }

    await fs.promises.unlink(filename); // remove file
  }
}
