import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });

  // rendre uploads accessible publiquement
  //app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use('/uploads', express.static('uploads'));

  await app.listen(3000);
}
bootstrap();