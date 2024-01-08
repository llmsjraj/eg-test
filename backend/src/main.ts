import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { MyLoggerService } from './common/logger/logger.service';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { CommonConfigService } from './common/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new MyLoggerService();
  app.useLogger(logger);

  const commonConfigService = app.get(CommonConfigService);

  const corsOptions: CorsOptions = {
    origin: commonConfigService.getOrigin(),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  app.useGlobalFilters(new ValidationExceptionFilter());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Eg Test')
    .setDescription('API description for Eg Test')
    .setVersion('1.0')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = 3000;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}

bootstrap();
