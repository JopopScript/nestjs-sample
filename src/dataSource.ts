import { DataSource } from 'typeorm';
import { Article } from './articles/entities/article.entity';
import { Picture } from './pictures/entities/picture.entity';
import { User } from './users/entities/user.entity';

export const typeormConfig = {
  type: 'sqlite' as const,
  database: ':memory:',
  entities: [
    User,
    Article,
    Picture,
  ],
  synchronize: true,
  logging: false,
};

const dataSource: DataSource = new DataSource(typeormConfig);

export default dataSource;
