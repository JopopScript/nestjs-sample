import { Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger/dist';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/error/all-exception.filter';

async function bootstrap(): Promise<void> {
  const nestAppOptions: NestApplicationOptions = {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  };
  const app = await NestFactory.create(AppModule, nestAppOptions);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (error: ValidationError[]) => error,
  }))
  app.useGlobalFilters(new AllExceptionsFilter(new Logger()));

  const documentConfig = new DocumentBuilder()
    .setTitle('keroro')
    .setDescription('keroro API 문서')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
