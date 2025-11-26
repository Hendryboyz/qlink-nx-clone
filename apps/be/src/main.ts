import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

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

  const globalPrefix = configService.get<string>('API_PREFIX', 'api');
  app.setGlobalPrefix(globalPrefix);

  app.useStaticAssets(join(process.cwd(), 'apps/be/uploads'), {
    prefix: '/uploads/',
    index: false,
    redirect: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
