import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = process.env.API_PREFIX || 'api';
  const port = process.env.PORT || 3000;

  app.use((req, res, next) => {
    Logger.log(`${req.method} ${req.url}`, 'Global Middleware');
    next();
  });

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  app.enableVersioning({
    type: VersioningType.URI,
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
    allowedHeaders: ['Content-Type', 'Authorization', 'pre-token'],
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
