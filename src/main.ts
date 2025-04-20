import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/exceptions/http-exception.filter';
import { ModelExceptionFilter } from './common/filters/exceptions/model-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter(), new ModelExceptionFilter());
  await app.listen(3000);
}

bootstrap();
