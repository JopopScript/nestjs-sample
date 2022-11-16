import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'time',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '생성일시`',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'time',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '수정일시`',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'time',
    comment: '삭제일시`',
    nullable: true,
  })
  deletedAt: Date;
}