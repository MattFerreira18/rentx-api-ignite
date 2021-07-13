import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import createConnection from '@shared/infra/database';
import { app } from '@shared/infra/http/app';

describe.skip('create category controller', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, driver_license, password, "isAdmin", created_at)
      values('${uuid()}', 'admin', 'admin@rentalx.com', 'XXX-XXX-XXX.XX', '${password}', true, 'now()')
      `,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new category', async () => {
    const {
      body: { token },
    } = await request(app).post('/auth').send({
      email: 'admin@rentalx.com',
      password: 'admin',
    });

    const response = await request(app)
      .post('/categories')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: 'SUV',
        description: 'a big car',
      });

    expect(response.status).toBe(201);
  });

  it('Should not be able to create a new category with a existing name', async () => {
    const {
      body: { token },
    } = await request(app).post('/auth').send({
      email: 'admin@rentalx.com',
      password: 'admin',
    });

    const response = await request(app)
      .post('/categories')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: 'SUV',
        description: 'a big car',
      });

    expect(response.status).toBe(409);
  });
});
