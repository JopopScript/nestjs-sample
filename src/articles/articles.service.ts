import { pagenation } from '@/common/dto/pagenation.dto';
import { CustomError, CustomErrorStatus } from '@/common/error/custom.error';
import { UsersService } from '@/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly usersService: UsersService
  ) {}
  
  async findAll({ page, pageSize }: pagenation): Promise<Array<Article>> {
    Logger.debug(`ArticleService |findAll() call |page: ${page} |pageSize: ${pageSize}`);
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    return await this.articleRepository.find({ skip, take });
  }

  async createWithUserId(userId: number, createArticleDto: CreateArticleDto): Promise<Article> {
    Logger.debug(`ArticleService |create() call |userId: ${userId} |createArticleDto: `, createArticleDto);
    await this.usersService.findOneById(userId);
    return await this.articleRepository.save({ ...createArticleDto, userId });
  }

  async findAllByUserId(userId: number, { page, pageSize }: pagenation): Promise<Array<Article>> {
    Logger.debug(`ArticleService |findAllByUserId() call |userId: ${userId} |page: ${page} |pageSize: ${pageSize}`);
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    return await this.articleRepository.find({
      where: { userId },
      skip,
      take
    });
  }
  
  async removeAllByUserId(userId: number): Promise<void> {
    Logger.debug(`ArticleService |remove() call |userId: ${userId}`);
    const articles = await this.articleRepository.findBy({ userId });
    await this.articleRepository.softRemove(articles);
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    Logger.debug(`ArticleService |update() call |id: ${id} |updateArticleDto: `, updateArticleDto);
    const originalArticle = await this.findOneById(id);
    return await this.articleRepository.save({ ...originalArticle, ...updateArticleDto });
  }

  async remove(id: number): Promise<void> {
    Logger.debug(`ArticleService |remove() call |id: ${id}`);
    const article = await this.findOneById(id);
    await this.articleRepository.softRemove(article);
  }

  async findOneById(id: number): Promise<Article> {
    Logger.debug(`ArticleService |findOneById() call |id: ${id}`);
    const article = await this.articleRepository.findOneBy({ id });
    if (article == null) {
      throw new CustomError(CustomErrorStatus.NO_RESULT, `article_id: ${id} |해당 id의 article이 존재하지 않습니다.`);
    }
    return article;
  }
}
