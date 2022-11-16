import { ArticlesModule } from '@/articles/articles.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Picture } from './entities/picture.entity';
import { PicturesController } from './pictures.controller';
import { PicturesService } from './pictures.service';

@Module({
  imports: [
    ArticlesModule,
    TypeOrmModule.forFeature([Picture])
  ],
  controllers: [PicturesController],
  providers: [PicturesService],
})
export class PicturesModule {}
