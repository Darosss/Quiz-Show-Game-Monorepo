import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './errors';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_FRONTEND_ORIGIN,
      methods: ['*'],
      credentials: true,
    },
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter({ httpAdapter }));
  app.use(cookieParser());

  //TODO: Import { SERVER_PORT } from ./configs doesnt work. Find out why
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
