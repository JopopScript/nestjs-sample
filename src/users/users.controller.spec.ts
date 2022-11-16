import { INestApplication, Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationError } from 'class-validator';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { AllExceptionsFilter } from '../common/error/all-exception.filter';
import dataSource from '../dataSource';
import { User } from './entities/user.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const nestAppOptions: NestApplicationOptions = { logger: ['error', 'warn', 'log', 'debug', 'verbose'] };
    app = moduleFixture.createNestApplication(nestAppOptions);
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      exceptionFactory: (error: ValidationError[]) => error,
    }))
    app.useGlobalFilters(new AllExceptionsFilter(new Logger()));
    await app.init();

    repository = moduleFixture.get('UserRepository');
    await repository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        { name: 'aero', email: 'aero@gmail.com' },
        { name: 'bero', email: 'bero@gmail.com' },
        { name: 'ciro', email: 'diro@gmail.com' },
        { name: 'dero', email: 'dero@gmail.com' },
        { name: 'eero', email: 'eero@gmail.com' },
        { name: 'firo', email: 'firo@gmail.com' },
        { name: 'gero', email: 'gero@gmail.com' },
        { name: 'hero', email: 'hero@gmail.com' },
        { name: 'iiro', email: 'iiro@gmail.com' },
      ])
      .execute();
  });

  afterEach(async () => {
    await repository.query('DELETE FROM user');
    await app.close();
  });

  it('디비 연결 확인', async () => {
    expect(repository).toBeDefined();
    expect(dataSource).toBeDefined();
  });

  it('(POST) /users', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'zero', email: 'zero@gmail.com' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        const user = response.body as User;
        expect(user).toMatchObject({
          id: 10,
          name: 'zero',
          email: 'zero@gmail.com',
        });
        const baseEntity = user as any;
        expect(baseEntity.createdAt).toBeDefined();
        expect(baseEntity.updatedAt).toBeDefined();
        expect(baseEntity.deleteAt).toBe(undefined);
      });
  });

  it('(GET) /users', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .query({ page: '2', pageSize: '3' })
      .expect(200)
      .then((response) => {
        const users = response.body as User[];
        const expectedUsers = [
          { name: 'dero', email: 'dero@gmail.com' },
          { name: 'eero', email: 'eero@gmail.com' },
          { name: 'firo', email: 'firo@gmail.com' },
        ];
        expect(users[0]).toMatchObject(expectedUsers[0]);
        expect(users[1]).toMatchObject(expectedUsers[1]);
        expect(users[2]).toMatchObject(expectedUsers[2]);
        users.forEach((user) => {
          const baseEntity = user as any;
          expect(baseEntity.id).toBeDefined();
          expect(baseEntity.createdAt).toBeDefined();
          expect(baseEntity.updatedAt).toBeDefined();
          expect(baseEntity.deleteAt).toBe(undefined);
        });
      });
  });
});
