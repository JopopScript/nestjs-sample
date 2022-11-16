import { Article } from '@/articles/entities/article.entity';
import { BaseEntity } from '@/common/entities/base-entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({ description: '표시될 사용자이름', maxLength: 20, example: 'keroro' })
  @Column({ type: 'varchar', length: 20 })
  name: string;

  @ApiProperty({  description: '사용자 고유 아이디',  maxLength: 200,  example: 'lssmm1230@gmail.com',  uniqueItems: true })
  @Column({ type: 'varchar', length: 200, unique: true })
  @Index({ unique: true })
  email: string;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];
}
