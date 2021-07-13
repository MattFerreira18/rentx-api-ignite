import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import createConnection from '@shared/infra/database';
import { app } from '@shared/infra/http/app';

describe.skip('list categories', () => {
  let connection: Connection;
  let token: string;

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, driver_license, password, "isAdmin", created_at)
      values('${uuid()}', 'admin', 'admin@rentalx.com', 'XXX-XXX-XXX.XX', '${password}', true, 'now()')
      `,
    );

    const response = await request(app).post('/auth').send({
      email: 'admin@rentalx.com',
      password: 'admin',
    });

    token = response.body.token;

    await request(app)
      .post('/categories')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: 'SUV',
        description: 'a big car',
      });

    await request(app)
      .post('/categories')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: 'hatch',
        description: 'a compact car',
      });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to list all categories', async () => {
    const response = await request(app)
      .get('/categories/all')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});
