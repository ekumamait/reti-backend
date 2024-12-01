import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

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

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('RETI Backend API')
    .setDescription('The RETI Backend API description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('profiles')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Handle 405 errors
  // app.use((_req, res, _next) => {
  //   res.status(405).json({ message: 'This URL does not exist' });
  // });

  // Handle server errors
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({
      message:
        'Oops! The problem is not on your side. Hang on, we will fix this soon',
    });
  });

  await app.listen(3000);
}
bootstrap();
