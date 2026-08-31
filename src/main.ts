import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes with transformation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Ensure every error response uses the same { status, message, data } envelope as success responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS
  const allowedOrigins = [
    process.env.LOCAL_FRONTEND_URL,
    process.env.FRONTEND_URL,
    process.env.LOCAL_FRONTEND_URL_ALT,
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('RETI Backend API')
    .setDescription('The RETI Backend API description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('profiles')
    .addTag('messages')
    .addTag('conversations')
    .addTag('jobemail')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(3000);
}
bootstrap();
