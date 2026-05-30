import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';

import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

app.enableCors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
});

  // rendre uploads accessible publiquement
  //app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use('/uploads', express.static('uploads'));

  app.useGlobalInterceptors(
    new TimingInterceptor(),
  );

  await app.listen(3000);
}
bootstrap();