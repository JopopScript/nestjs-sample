import { INestApplication, Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationError } from 'class-validator';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { Article } from '../articles/entities/article.entity';
import { AllExceptionsFilter } from '../common/error/all-exception.filter';
import dataSource from '../dataSource';
import { User } from '../users/entities/user.entity';
import { Picture } from './entities/picture.entity';

describe('PicturesController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Picture>;

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

    repository = moduleFixture.get('PictureRepository');
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
        { title: '제목2', contents: '내용2', userId: 2 },
      ])
      .execute();
    await repository
      .createQueryBuilder()
      .insert()
      .into(Picture)
      .values([
        { name: 'zeroro1', url: 'https://www.google.com/imgres?imgurl=https://abc1', articleId: 1 },
        { name: 'zeroro2', url: 'https://www.google.com/imgres?imgurl=https://abc2', articleId: 1 },
        { name: 'zeroro3', url: 'https://www.google.com/imgres?imgurl=https://abc3', articleId: 1 },
        { name: 'zeroro4', url: 'https://www.google.com/imgres?imgurl=https://abc4', articleId: 1 },
        { name: 'zeroro5', url: 'https://www.google.com/imgres?imgurl=https://abc5', articleId: 1 },
        { name: 'zeroro6', url: 'https://www.google.com/imgres?imgurl=https://abc6', articleId: 2 },
        { name: 'zeroro7', url: 'https://www.google.com/imgres?imgurl=https://abc7', articleId: 2 },
        { name: 'zeroro8', url: 'https://www.google.com/imgres?imgurl=https://abc8', articleId: 2 },
        { name: 'zeroro9', url: 'https://www.google.com/imgres?imgurl=https://abc9', articleId: 2 },
        { name: 'zeroro0', url: 'https://www.google.com/imgres?imgurl=https://abc0', articleId: 2 },
      ])
      .execute();
  });

  afterEach(async () => {
    await repository.query('DELETE FROM picture');
    await repository.query('DELETE FROM article');
    await repository.query('DELETE FROM user');
    await app.close();
  });

  it('디비 연결 확인', async () => {
    expect(repository).toBeDefined();
    expect(dataSource).toBeDefined();
  });
  
  it('(GET) /pictures', async () => {
    const expectedPictures = [
      { name: 'zeroro7', url: 'https://www.google.com/imgres?imgurl=https://abc7', articleId: 2 },
      { name: 'zeroro8', url: 'https://www.google.com/imgres?imgurl=https://abc8', articleId: 2 },
      { name: 'zeroro9', url: 'https://www.google.com/imgres?imgurl=https://abc9', articleId: 2 },
    ]
    await request(app.getHttpServer())
      .get('/pictures?page=3&pageSize=3')
      .expect(200)
      .then((response) => {
        const pictures = response.body as Picture[];
        expect(pictures.length).toBe(3);
        for (let i = 0; i < pictures.length; i++) {
          expect(pictures[i]).toMatchObject(expectedPictures[i]);
          const baseEntity = pictures[i] as any;
          expect(baseEntity.createdAt).toBeDefined();
          expect(baseEntity.updatedAt).toBeDefined();
          expect(baseEntity.deleteAt).toBe(undefined);
        }
      });
  });

  it('(POST) /users/:user_id/articles/:article_id/pictures', async () => {
    return request(app.getHttpServer())
      .post('/users/1/articles/1/pictures')
      .send({ name: '강아지', url: 'https://www.google.com/imgres?imgurl=https://abc99' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        const picture = response.body as Picture;
        expect(picture).toMatchObject({ id: 11, name: '강아지', url: 'https://www.google.com/imgres?imgurl=https://abc99', articleId: 1 });
        const baseEntity = picture as any;
        expect(baseEntity.createdAt).toBeDefined();
        expect(baseEntity.updatedAt).toBeDefined();
        expect(baseEntity.deleteAt).toBe(undefined);
      });
  });

  it('(GET) /users/:user_id/articles/:article_id/pictures', async () => {
    return request(app.getHttpServer())
      .get('/users/2/articles/2/pictures')
      .query({ page: '2', pageSize: '2' })
      .expect(200)
      .then((response) => {
        const pictures = response.body as Picture[];
        const expectedPictures = [
          { name: 'zeroro8', url: 'https://www.google.com/imgres?imgurl=https://abc8', articleId: 2 },
          { name: 'zeroro9', url: 'https://www.google.com/imgres?imgurl=https://abc9', articleId: 2 },
        ];
        expect(pictures.length).toBe(2);
        for (let i = 0; i < pictures.length; i++) {
          expect(pictures[i]).toMatchObject(expectedPictures[i]);
          const baseEntity = pictures[i] as any;
          expect(baseEntity.createdAt).toBeDefined();
          expect(baseEntity.updatedAt).toBeDefined();
          expect(baseEntity.deleteAt).toBe(undefined);
        }
      });
  });

  it('(DELETE) /users/:user_id/articles/:article_id/pictures', async () => {
    return request(app.getHttpServer())
      .delete('/users/1/articles/2/pictures')
      .expect(200);
  });

  it('(GET) /users/:user_id/articles/:article_id/pictures/:picture_id', async () => {
    return request(app.getHttpServer())
      .get('/users/1/articles/2/pictures/10')
      .expect(200)
      .then((response) => {
        const picture = response.body as Picture;
        const expectedPicture = { id: 10, name: 'zeroro0', url: 'https://www.google.com/imgres?imgurl=https://abc0', articleId: 2 };
        expect(picture).toMatchObject(expectedPicture);
        const baseEntity = picture as any;
        expect(baseEntity.createdAt).toBeDefined();
        expect(baseEntity.updatedAt).toBeDefined();
        expect(baseEntity.deleteAt).toBe(undefined);
      });
  });

  it('(PATCH) /users/:user_id/articles/:article_id/pictures/:picture_id', async () => {
    return request(app.getHttpServer())
      .patch('/users/2/articles/2/pictures/7')
      .send({ name: '강아지', url: 'https://www.google.com/imgres?imgurl=https://abc1000' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        const picture = response.body as Picture[];
        expect(picture).toMatchObject({ id: 7, name: '강아지', url: 'https://www.google.com/imgres?imgurl=https://abc1000', articleId: 2 });
        const baseEntity = picture as any;
        expect(baseEntity.createdAt).toBeDefined();
        expect(baseEntity.updatedAt).toBeDefined();
        expect(baseEntity.deleteAt).toBe(undefined);
      });
  });

  it('(DELETE) /users/:user_id/articles/:article_id/pictures/:picture_id', async () => {
    return request(app.getHttpServer())
      .patch('/users/1/articles/2/pictures/6')
      .expect(200);
  });
});