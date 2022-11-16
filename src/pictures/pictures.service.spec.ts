import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticlesService } from '../articles/articles.service';
import { Article } from '../articles/entities/article.entity';
import { pagenation } from '../common/dto/pagenation.dto';
import { StubTypeOrmRepository } from '../test/typeorm-repository.stub';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { Picture } from './entities/picture.entity';
import { PicturesService } from './pictures.service';

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

const mockArticlesModule = {
  module: class ArticlesModule {},
  imports: [mockUsersModule],
  providers: [
    ArticlesService,
    {
      provide: getRepositoryToken(Article),
      useClass: Repository,
    },
  ],
  exports: [ArticlesService],
};

describe('PicturesService', () => {
  let service: PicturesService;
  let articlesService: ArticlesService;
  let repository: Repository<Picture>;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [mockArticlesModule],
      providers: [
        PicturesService,
        {
          provide: getRepositoryToken(Picture),
          useValue: new StubTypeOrmRepository<Picture>(),
        },
      ],
    }).compile();
    service = module.get(PicturesService);
    articlesService = module.get(ArticlesService);
    repository = module.get(getRepositoryToken(Picture));
    repository.save({ name: 'zeroro1', url: 'https://www.google.com/imgres?imgurl=https://abc1', articleId: 1 });
    repository.save({ name: 'zeroro2', url: 'https://www.google.com/imgres?imgurl=https://abc2', articleId: 1 });
    repository.save({ name: 'zeroro3', url: 'https://www.google.com/imgres?imgurl=https://abc3', articleId: 1 });
    repository.save({ name: 'zeroro4', url: 'https://www.google.com/imgres?imgurl=https://abc4', articleId: 1 });
    repository.save({ name: 'zeroro5', url: 'https://www.google.com/imgres?imgurl=https://abc5', articleId: 1 });
    repository.save({ name: 'zeroro6', url: 'https://www.google.com/imgres?imgurl=https://abc6', articleId: 2 });
    repository.save({ name: 'zeroro7', url: 'https://www.google.com/imgres?imgurl=https://abc7', articleId: 2 });
    repository.save({ name: 'zeroro8', url: 'https://www.google.com/imgres?imgurl=https://abc7', articleId: 2 });
    repository.save({ name: 'zeroro9', url: 'https://www.google.com/imgres?imgurl=https://abc8', articleId: 2 });
    repository.save({ name: 'zeroro0', url: 'https://www.google.com/imgres?imgurl=https://abc0', articleId: 2 });
  });

  it('findAll 정상처리', async () => {
    // when
    const foundArticles = await service.findAll({ page: 3, pageSize: 2 });

    //then
    const expectedArticles = [
      { id: 5, name: 'zeroro5', url: 'https://www.google.com/imgres?imgurl=https://abc5', articleId: 1 },
      { id: 6, name: 'zeroro6', url: 'https://www.google.com/imgres?imgurl=https://abc6', articleId: 2 },
    ]
    for (let i = 0; i < foundArticles.length; i++) {
      expect(foundArticles[i]).toMatchObject(expectedArticles[i]);
    }
  });

  it('createWithArticleId 정상처리', async () => {
    //given
    articlesService.findOneById = jest.fn().mockResolvedValue({} as Article)
    const id = 1;
    const articleDto = { name: '강아지', url: 'https://www.google.com/imgres?imgurl=https://poizxc' }

    // when
    await service.createWithArticleId(id, articleDto);

    //then
    const isExistRepository = await repository.findOne({ where: articleDto });
    expect(isExistRepository == null).toBe(false);
  });

  it('findAllByArticleId 정상처리', async () => {
    // when
    const foundPictures = await service.findAllByArticleId(1, { page: 1, pageSize: 2 } as pagenation);

    //then
    const expectedPicture = [
      { id: 1, name: 'zeroro1', url: 'https://www.google.com/imgres?imgurl=https://abc1', articleId: 1 },
      { id: 2, name: 'zeroro2', url: 'https://www.google.com/imgres?imgurl=https://abc2', articleId: 1 },
    ]
    for (let i = 0; i < foundPictures.length; i++) {
      expect(foundPictures[i]).toMatchObject(expectedPicture[i]);
    }
  });

  it('removeAllByArticleId 정상처리', async () => {
    // when
    await service.removeAllByArticleId(2);

    //then
    const isExistRepository = await repository.findBy({ articleId: 2 });
    expect(isExistRepository.length).toBe(0);
  });

  it('findOneById 정상처리', async () => {
    // when
    const foundArticle = await service.findOneById(4);

    //then
    expect(foundArticle).toMatchObject({ id: 4, name: 'zeroro4', url: 'https://www.google.com/imgres?imgurl=https://abc4', articleId: 1 });
  });

  it('update 정상처리', async () => {
    //given
    const updatePictureDto: UpdatePictureDto = { name: 'hello' };

    // when
    await service.update(1, updatePictureDto);

    //then
    const changedPicture = await repository.findOneBy({ id: 1 });
    expect(changedPicture).toMatchObject({ id: 1, name: 'hello', url: 'https://www.google.com/imgres?imgurl=https://abc1', articleId: 1 });
  });


  it('remove 정상처리', async () => {
    // when
    await service.remove(10);

    //then
    const removedPicture = await repository.findOneBy({ id: 10 });
    expect(removedPicture).toBe(null);
  });
});
