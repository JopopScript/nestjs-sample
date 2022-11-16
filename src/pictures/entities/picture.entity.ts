import { Article } from '@/articles/entities/article.entity';
import { BaseEntity } from '@/common/entities/base-entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Picture extends BaseEntity {
  @ApiProperty({ description: '사진 이름', maxLength: 255, example: '강아지' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: '사진 경로',
    example: 'https://www.google.com/imgres?imgurl=https://abcd',
  })
  @Column({ type: 'varchar' })
  url: string;
  
  @ApiProperty({ type: 'integer', description: '사진이 포함된 글 id', example: 1 })
  @Column({ type: 'int4', name: 'article_id' })
  articleId: number;

  @ApiProperty({ type: () => Article })
  @ManyToOne(() => Article, (article) => article.pictures, { cascade: ['update'] })
  @JoinColumn([{ name: 'article_id', referencedColumnName: 'id' }])
  article: Article;
}
