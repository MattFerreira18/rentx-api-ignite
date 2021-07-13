import createConnection from '../index';
import { createAdmin } from './admin';

(async function main(): Promise<void> {
  const connection = await createConnection('localhost');

  await createAdmin(connection);

  await connection.close();
}());
