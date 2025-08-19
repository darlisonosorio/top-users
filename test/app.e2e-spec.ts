import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';
import { AppModule } from '../src/app.module';
import { UserForm } from '../src/model/dto/user-form';
import { UserStatus } from '../src/model/enum/user-status';
import knexConfig from './knexfile';
import knex from 'knex';

describe('User Microservice (E2E)', () => {
  let app: INestMicroservice;
  let client: any;
  let db: any;

  beforeAll(async () => {
    db = knex(knexConfig.test);
    await db.migrate.latest();
    await db.seed.run();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 8866 },
    });

    await app.listen();

    client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 8866 },
    });

    await client.connect();
  });

  afterAll(async () => {
    await db.destroy();
    await client.close();
    await app.close();
  });

  it('ping should return pong users', async () => {
    const response = await client.send({ cmd: 'ping' }, {}).toPromise();
    expect(response).toBe('pong users');
  });

  it('should create, find, update and delete a user', async () => {
    const now = Date.now().toString();
    const user: UserForm = {
      name: 'User_'+ now, 
      email: `user_${now}@gmail.com`,
      street: 'street1',
      street_number: '1000',
      neighborhood: 'neighborhood',
      complement: 'complement',
      city: 'manaus',
      state: 'state',
      zip_code: '234234',
      status: UserStatus.ACTIVE
    };

    const created = await client.send({ cmd: 'create-user' }, user).toPromise();

    const found = await client.send({ cmd: 'find-user' }, { id: created.id }).toPromise();
    expect(found.name).toBe(user.name);

    const updated = await client.send({ cmd: 'update-user' }, { id: created.id, name: 'Jane Updated' }).toPromise();
    expect(updated.name).toBe('Jane Updated');

    const deleted = await client.send({ cmd: 'delete-user' }, { id: created.id }).toPromise();
    expect(deleted).toBeTruthy();
  });
});
