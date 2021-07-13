import { hash } from 'bcrypt';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

export async function createAdmin(connection: Connection): Promise<void> {
  const password = await hash('admin', 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, driver_license, password, "isAdmin", created_at)
    values('${uuid()}', 'admin', 'admin@rentx.com', 'XXX-XXX-XXX.XX', '${password}', true, 'now()')
    `,
  );

  console.log('created user admin');
}
