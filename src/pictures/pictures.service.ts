import { ArticlesService } from '@/articles/articles.service';
import { pagenation } from '@/common/dto/pagenation.dto';
import { CustomError, CustomErrorStatus } from '@/common/error/custom.error';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { Picture } from './entities/picture.entity';

@Injectable()
export class PicturesService {
  constructor(
    @InjectRepository(Picture) private readonly pictureRepository: Repository<Picture>,
    private readonly articlesService: ArticlesService
  ) {}

  async findAll({ page, pageSize }: pagenation): Promise<Array<Picture>> {
    Logger.debug(`PictureService |findAll() call |page: ${page} |pageSize: ${pageSize}`);
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    return await this.pictureRepository.find({ skip, take });
  }
  
  async createWithArticleId(articleId: number, createPictureDto: CreatePictureDto): Promise<Picture> {
    Logger.debug(`pictureId |create() call |articleId: ${articleId} |createPictureDto: `, createPictureDto);
    await this.articlesService.findOneById(articleId);
    return await this.pictureRepository.save({ ...createPictureDto, articleId });
  }

  async findAllByArticleId(articleId: number, { page, pageSize }: pagenation): Promise<Array<Picture>> {
    Logger.debug(`PictureService |findAllByArticleId() call |articleId: ${articleId} |page: ${page} |pageSize: ${pageSize}`);
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    return await this.pictureRepository.find({
      where: { articleId },
      skip,
      take
    });
  }
  
  async removeAllByArticleId(articleId: number): Promise<void> {
    Logger.debug(`PictureService |remove() call |articleId: ${articleId}`);
    const pictures = await this.pictureRepository.findBy({ articleId });
    await this.pictureRepository.softRemove(pictures);
  }

  async findOneById(id: number): Promise<Picture> {
    Logger.debug(`PictureService |findOneById() call |id: ${id}`);
    const picture = await this.pictureRepository.findOneBy({ id });
    if (picture == null) {
      throw new CustomError(CustomErrorStatus.NO_RESULT, `picture_id: ${id} |해당 id의 picture가 존재하지 않습니다.`);
    }
    return picture;
  }

  async update(id: number, updatePictureDto: UpdatePictureDto): Promise<Picture> {
    Logger.debug(`PictureService |update() call |id: ${id} |updatePictureDto: `, updatePictureDto);
    const originalPicture = await this.findOneById(id);
    return await this.pictureRepository.save({ ...originalPicture, ...updatePictureDto });
  }

  async remove(id: number): Promise<void> {
    Logger.debug(`PictureService |remove() call |id: ${id}`);
    const picture = await this.findOneById(id);
    await this.pictureRepository.softRemove(picture);
  }
}
