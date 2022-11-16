import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { pagenation } from '../common/dto/pagenation.dto';
import { StubTypeOrmRepository } from '../test/typeorm-repository.stub';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ArticlesService } from './articles.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

const mockUsersModule = {
  module: class UsersModule {},
  providers: [
    UsersService,
    {
      provide: getRepositoryToken(User),
      useClass: Repository,
    },
  ],
  exports: [UsersService],
};


describe('ArticlesService', () => {
  let service: ArticlesService;
  let usersService: UsersService;
  let repository: Repository<Article>;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [mockUsersModule],
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: new StubTypeOrmRepository<Article>(),
        },
      ],
    }).compile();
    service = module.get(ArticlesService);
    usersService = module.get(UsersService);
    repository = module.get(getRepositoryToken(Article));
    repository.save({ title: 'zeroro1', contents: '내용', userId: 1 });
    repository.save({ title: 'zeroro2', contents: '내용', userId: 1 });
    repository.save({ title: 'zeroro3', contents: '내용', userId: 1 });
    repository.save({ title: 'zeroro4', contents: '내용', userId: 1 });
    repository.save({ title: 'zeroro5', contents: '내용', userId: 1 });
    repository.save({ title: 'zeroro6', contents: '내용', userId: 2 });
    repository.save({ title: 'zeroro7', contents: '내용', userId: 2 });
    repository.save({ title: 'zeroro8', contents: '내용', userId: 2 });
    repository.save({ title: 'zeroro9', contents: '내용', userId: 2 });
    repository.save({ title: 'zeroro0', contents: '내용', userId: 2 });
  });

  it('findAll 정상처리', async () => {
    // when
    const foundArticles = await service.findAll({ page: 3, pageSize: 2 });

    //then
    const expectedArticles = [
      { id: 5, title: 'zeroro5', contents: '내용', userId: 1 },
      { id: 6, title: 'zeroro6', contents: '내용', userId: 2 },
    ]
    for (let i = 0; i < foundArticles.length; i++) {
      expect(foundArticles[i]).toMatchObject(expectedArticles[i]);
    }
  });

  it('createWithUserId 정상처리', async () => {
    //given
    usersService.findOneById = jest.fn().mockResolvedValue({} as User)
    const id = 1;
    const articleDto = { title: 'zeroro99', contents: '내용' }

    // when
    await service.createWithUserId(id, articleDto);

    //then
    const isExistRepository = await repository.findOne({ where: articleDto });
    expect(isExistRepository == null).toBe(false);
  });

  it('findAllByUserId 정상처리', async () => {
    // when
    const foundArticles = await service.findAllByUserId(1, { page: 1, pageSize: 2 } as pagenation);

    //then
    const expectedArticles = [
      { id: 1, title: 'zeroro1', contents: '내용', userId: 1 },
      { id: 2, title: 'zeroro2', contents: '내용', userId: 1 },
    ]
    for (let i = 0; i < foundArticles.length; i++) {
      expect(foundArticles[i]).toMatchObject(expectedArticles[i]);
    }
  });

  it('removeAllByUserId 정상처리', async () => {
    // when
    await service.removeAllByUserId(1);

    //then
    const isExistRepository = await repository.findBy({ userId: 1 });
    expect(isExistRepository.length).toBe(0);
  });
  
  it('update 정상처리', async () => {
    //given
    const updateArticleDto: UpdateArticleDto = { title: 'giroro' };

    // when
    await service.update(1, updateArticleDto);

    //then
    const changedArticle = await repository.findOneBy({ id: 1 });
    expect(changedArticle).toMatchObject({ id: 1, title: 'giroro', contents: '내용', userId: 1 });
  });
  
  it('remove 정상처리', async () => {
    // when
    await service.remove(1);

    //then
    const removedArticle = await repository.findOneBy({ id: 1 });
    expect(removedArticle).toBe(null);
  });
  
  it('findOneById 정상처리', async () => {
    // when
    const foundArticle = await service.findOneById(1);

    //then
    expect(foundArticle).toMatchObject({ id: 1, title: 'zeroro1', contents: '내용', userId: 1 });
  });
});
