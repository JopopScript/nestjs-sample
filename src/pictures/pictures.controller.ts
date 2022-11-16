import { PagenationDto } from '@/common/dto/pagenation.dto';
import {
  Body,
  Controller, Delete, Get,
  Param,
  ParseIntPipe, Patch, Post,
  Query
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation, ApiParam, getSchemaPath
} from '@nestjs/swagger';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { Picture } from './entities/picture.entity';
import { PicturesService } from './pictures.service';

const PICTURES = 'pictures' as const;
@Controller()
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @Get('pictures')
  @ApiOperation({ tags: [PICTURES], summary: '사진 전체조회', description: '모든사진을 페이지별로 조회합니다.' })
  @ApiOkResponse({
    description: '사진 전체목록',
    schema: { type: 'array', items: { $ref: getSchemaPath(Picture) } },
  })
  findAll(@Query() query: PagenationDto) {
    return this.picturesService.findAll(query.transform());
  }

  @Post('users/:user_id/articles/:article_id/pictures')
  @ApiOperation({ tags: [PICTURES], summary: '사진 첨부', description: '글에 사진을 첨부합니다.' })
  @ApiParam({ name: 'article_id' })
  @ApiBody({ type: CreatePictureDto })
  @ApiCreatedResponse({ type: Picture, description: '첨부된 사진 정보' })
  create(@Param('article_id', ParseIntPipe) articleId: number, @Body() createPictureDto: CreatePictureDto): Promise<Picture> {
    return this.picturesService.createWithArticleId(articleId, createPictureDto);
  }

  @Get('users/:user_id/articles/:article_id/pictures')
  @ApiOperation({ tags: [PICTURES], summary: '글에 첨부된 사진 목록조회', description: '글에 첨부된 사진을 페이지별로 조회합니다.' })
  @ApiParam({ name: 'article_id' })
  @ApiOkResponse({
    description: '글별 사진목록',
    schema: { type: 'array', items: { $ref: getSchemaPath(Picture) } },
  })
  findAllByArticleId(@Param('article_id', ParseIntPipe) articleId: number, @Query() query: PagenationDto) {
    return this.picturesService.findAllByArticleId(articleId, query.transform());
  }

  @Delete('users/:user_id/articles/:article_id/pictures')
  @ApiOperation({ tags: [PICTURES], summary: '사진 목록 삭제', description: '해당 글에 첨부된 사진을 전부 삭제합니다.' })
  @ApiParam({ name: 'article_id' })
  @ApiOkResponse()
  removeAll(@Param('article_id', ParseIntPipe) articleId: number): Promise<void> {
    return this.picturesService.removeAllByArticleId(articleId);
  }

  @Get('users/:user_id/articles/:article_id/pictures/:picture_id')
  @ApiOperation({ tags: [PICTURES], summary: '사진 하나 조회', description: 'id에 해당하는 사진을 조회합니다.' })
  @ApiParam({ name: 'picture_id' })
  @ApiOkResponse({ type: Picture, description: '조회한 사진 정보' })
  findOneById(@Param('picture_id', ParseIntPipe) pictureId: number): Promise<Picture> {
    return this.picturesService.findOneById(pictureId);
  }

  @Patch('users/:user_id/articles/:article_id/pictures/:picture_id')
  @ApiOperation({ tags: [PICTURES], summary: '사진 수정', description: '사진을 수정합니다.' })
  @ApiParam({ name: 'picture_id' })
  @ApiBody({ type: UpdatePictureDto })
  @ApiOkResponse({ type: Picture, description: '수정된 사진 정보' })
  update(@Param('picture_id', ParseIntPipe) pictureId: number, @Body() updatePictureDto: UpdatePictureDto): Promise<Picture> {
    return this.picturesService.update(pictureId, updatePictureDto);
  }

  @Delete('users/:user_id/articles/:article_id/pictures/:picture_id')
  @ApiOperation({ tags: [PICTURES], summary: '사진 한개 삭제', description: '사진을 한개 삭제합니다.' })
  @ApiParam({ name: 'picture_id' })
  @ApiOkResponse()
  remove(@Param('picture_id', ParseIntPipe) pictureId: number): Promise<void> {
    return this.picturesService.remove(pictureId);
  }
}
