import { BaseEntity } from '@/common/entities/base-entity';
import { Picture } from '@/pictures/entities/picture.entity';
import { User } from '@/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Article extends BaseEntity {
  @ApiProperty({
    description: '글 제목',
    maxLength: 255,
    example: '튜토리얼',
  })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({
    description: '본문 내용',
    example: '시작하는법!....',
  })
  @Column({ type: 'text' })
  contents: string;
  
  @ApiProperty({ type: 'integer', description: '글작성 사용자 id', example: 1 })
  @Column({ type: 'int4', name: 'user_id' })
  userId: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.articles, { cascade: ['update'] })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => Picture, (picture) => picture.article)
  pictures: Picture[];
}
