import bcrypt from 'bcrypt';

import { IEncryptsProvider } from './IEncryptsProvider';

export class EncryptsProvider implements IEncryptsProvider {
  async hash(data: string): Promise<string> {
    const dataHashed = await bcrypt.hash(data, 8);

    return dataHashed;
  }

  async compare(data: string, hash: string): Promise<boolean> {
    const compare = await bcrypt.compare(data, hash);

    return compare;
  }
}
