import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('RETI Backend API')
    .setDescription('The RETI Backend API description')
    .setVersion('1.0')
    .addTag('profiles')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
