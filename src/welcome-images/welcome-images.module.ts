import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WelcomeImagesController } from './welcome-images.controller';
import { WelcomeImagesService } from './welcome-images.service';
import { WelcomeImage } from '../database/entities/welcome-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WelcomeImage])],
  controllers: [WelcomeImagesController],
  providers: [WelcomeImagesService],
  exports: [WelcomeImagesService],
})
export class WelcomeImagesModule {}
