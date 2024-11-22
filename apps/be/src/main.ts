import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'api';
  const port = process.env.PORT || 3000;

  app.use((req, res, next) => {
    Logger.log(`${req.method} ${req.url}`, 'Global Middleware');
    next();
  });

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || process.env.ALLOWED_ORIGINS.split(',').includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix(globalPrefix);

  app.useStaticAssets(join(process.cwd(), 'apps/be/uploads'), {
    prefix: '/uploads/',
    index: false,
    redirect: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
