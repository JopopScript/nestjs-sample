import { PagenationDto } from '@/common/dto/pagenation.dto';
import {
  Body,
  Controller, Delete, Get,
  Param,
  ParseIntPipe, Patch, Post, Query
} from '@nestjs/common';
import {
  ApiBody, ApiCreatedResponse, ApiOkResponse,
  ApiOperation, ApiParam, getSchemaPath
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

const ARTICLES = 'articles' as const;
@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('articles')
  @ApiOperation({ tags: [ARTICLES], summary: '글 목록 전체조회', description: '전체 글 목록을 페이지별로 조회합니다.' })
  @ApiOkResponse({
    description: '전체글 목록',
    schema: { type: 'array', items: { $ref: getSchemaPath(Article) } },
  })
  findAll(@Query() query: PagenationDto) {
    return this.articlesService.findAll(query.transform());
  }

  @Post('users/:user_id/articles')
  @ApiOperation({ tags: [ARTICLES], summary: '글 생성', description: '글을 생성합니다.' })
  @ApiParam({ name: 'user_id' })
  @ApiBody({ type: CreateArticleDto })
  @ApiCreatedResponse({ type: Article, description: '생성한 글 정보' })
  create(@Param('user_id', ParseIntPipe) userId: number, @Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articlesService.createWithUserId(userId, createArticleDto);
  }

  @Get('users/:user_id/articles')
  @ApiOperation({ tags: [ARTICLES], summary: '사용자별 작성글 목록 조회', description: '사용자별 작성글을 페이지별로 조회합니다.' })
  @ApiParam({ name: 'user_id' })
  @ApiOkResponse({
    description: '사용자별 작성글 목록',
    schema: { type: 'array', items: { $ref: getSchemaPath(Article) } },
  })
  findAllByUserId(@Param('user_id', ParseIntPipe) userId: number, @Query() query: PagenationDto) {
    return this.articlesService.findAllByUserId(userId, query.transform());
  }

  @Delete('/users/:user_id/articles')
  @ApiOperation({ tags: [ARTICLES], summary: '사용자 작성글 삭제', description: '사용자가 작성한 모든 글을 삭제합니다.' })
  @ApiParam({ name: 'user_id' })
  @ApiOkResponse()
  removeAllByUserId(@Param('user_id', ParseIntPipe) userId: number): Promise<void> {
    return this.articlesService.removeAllByUserId(userId);
  }
  
  @Patch('users/:user_id/articles/:article_id')
  @ApiOperation({ tags: [ARTICLES], summary: '글 수정', description: '글을 수정합니다.' })
  @ApiParam({ name: 'article_id' })
  @ApiBody({ type: UpdateArticleDto })
  @ApiOkResponse({ type: Article, description: '수정된 글 정보' })
  update(@Param('article_id', ParseIntPipe) articleId: number, @Body() updateArticleDto: UpdateArticleDto): Promise<Article> {
    return this.articlesService.update(articleId, updateArticleDto);
  }

  @Delete('users/:user_id/articles/:article_id')
  @ApiOperation({ tags: [ARTICLES], summary: '글 한개 삭제', description: '글을 한개 삭제합니다.' })
  @ApiParam({ name: 'article_id' })
  @ApiOkResponse()
  remove(@Param('article_id', ParseIntPipe) articleId: number): Promise<void> {
    return this.articlesService.remove(articleId);
  }
}
