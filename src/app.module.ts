import { AppController } from '@/app.controller';
import { typeormConfig } from '@/dataSource';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PicturesModule } from './pictures/pictures.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeormConfig),
    UsersModule,
    ArticlesModule,
    PicturesModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      .exclude({ path: '/', method: RequestMethod.GET })
      .forRoutes('*')
  }
}
