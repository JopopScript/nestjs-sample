import { INestApplication, Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationError } from 'class-validator';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { AllExceptionsFilter } from '../common/error/all-exception.filter';
import dataSource from '../dataSource';
import { User } from '../users/entities/user.entity';
import { Article } from './entities/article.entity';

describe('ArticlesController (e2e)', () => {
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

    repository = moduleFixture.get('ArticleRepository');
    await repository
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
      { name: 'aero', email: 'aero@gmail.com' },
      { name: 'bero', email: 'bero@gmail.com' },
    ])
    .execute();
    await repository
      .createQueryBuilder()
      .insert()
      .into(Article)
      .values([
        { title: '제목1', contents: '내용1', userId: 1 },
        { title: '제목2', contents: '내용2', userId: 1 },
        { title: '제목3', contents: '내용3', userId: 1 },
        { title: '제목4', contents: '내용4', userId: 1 },
        { title: '제목5', contents: '내용5', userId: 1 },
        { title: '제목6', contents: '내용6', userId: 2 },
        { title: '제목7', contents: '내용7', userId: 2 },
        { title: '제목8', contents: '내용8', userId: 2 },
        { title: '제목9', contents: '내용9', userId: 2 },
        { title: '제목0', contents: '내용0', userId: 2 },
      ])
      .execute();
  });

  afterEach(async () => {
    await repository.query('DELETE FROM article');
    await repository.query('DELETE FROM user');
    await app.close();
  });

  it('디비 연결 확인', async () => {
    expect(repository).toBeDefined();
    expect(dataSource).toBeDefined();
  });
  
  it('(GET) /articles', async () => {
    const expectedArticles = [
      { title: '제목4', contents: '내용4', userId: 1 },
      { title: '제목5', contents: '내용5', userId: 1 },
      { title: '제목6', contents: '내용6', userId: 2 },
    ]
    await request(app.getHttpServer())
      .get('/articles?page=2&pageSize=3')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        const articles = response.body as Article[];
        expect(articles.length).toBe(3);
        for (let i = 0; i < articles.length; i++) {
          expect(articles[i]).toMatchObject(expectedArticles[i]);
          const baseEntity = articles[i] as any;
          expect(baseEntity.createdAt).toBeDefined();
          expect(baseEntity.updatedAt).toBeDefined();
          expect(baseEntity.deleteAt).toBe(undefined);
        }
      });
  });

  it('(POST) /users/:user_id/articles', async () => {
    return request(app.getHttpServer())
      .post('/users/2/articles')
      .send({ title: 'asdasd', contents: 'zxcasdqwe' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        const article = response.body as Article;
        expect(article).toMatchObject({ id: 11, title: 'asdasd', contents: 'zxcasdqwe', userId: 2 });
        const baseEntity = article as any;
        expect(baseEntity.createdAt).toBeDefined();
        expect(baseEntity.updatedAt).toBeDefined();
        expect(baseEntity.deleteAt).toBe(undefined);
      });
  });

  it('(GET) /users/:user_id/articles', async () => {
    return request(app.getHttpServer())
      .get('/users/1/articles')
      .query({ page: '2', pageSize: '2' })
      .expect(200)
      .then((response) => {
        const articles = response.body as Article[];
        const expectedArticles = [
          { id: 3, title: '제목3', contents: '내용3', userId: 1 },
          { id: 4, title: '제목4', contents: '내용4', userId: 1 },
        ];
        expect(articles.length).toBe(2);
        for (let i = 0; i < articles.length; i++) {
          expect(articles[i]).toMatchObject(expectedArticles[i]);
          const baseEntity = articles[i] as any;
          expect(baseEntity.createdAt).toBeDefined();
          expect(baseEntity.updatedAt).toBeDefined();
          expect(baseEntity.deleteAt).toBe(undefined);
        }
      });
  });

  it('(DELETE) /users/:user_id/articles', async () => {
    return request(app.getHttpServer())
      .delete('/users/2/articles')
      .expect(200);
  });

  it('(PATCH) /users/:user_id/articles/:article_id', async () => {
    return request(app.getHttpServer())
      .patch('/users/1/articles/2')
      .send({ title: 'zzzzzz', contents: 'qqqqq' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        const article = response.body as Article[];
        expect(article).toMatchObject({ id: 2, title: 'zzzzzz', contents: 'qqqqq', userId: 1 });
        const baseEntity = article as any;
        expect(baseEntity.createdAt).toBeDefined();
        expect(baseEntity.updatedAt).toBeDefined();
        expect(baseEntity.deleteAt).toBe(undefined);
      });
  });

  it('(DELETE) /users/:user_id/articles/:article_id', async () => {
    return request(app.getHttpServer())
      .patch('/users/2/articles/6')
      .expect(200);
  });
});