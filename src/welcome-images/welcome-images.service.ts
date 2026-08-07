import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WelcomeImage } from '../database/entities/welcome-image.entity';
import { CreateWelcomeImageDto } from './dto/create-welcome-image.dto';
import { UpdateWelcomeImageDto } from './dto/update-welcome-image.dto';
import { ApiResponse, returnResponse } from '../common/response.util';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../common/constants';

@Injectable()
export class WelcomeImagesService {
  constructor(
    @InjectRepository(WelcomeImage)
    private readonly welcomeImagesRepository: Repository<WelcomeImage>,
  ) {}

  async findAll(): Promise<ApiResponse<WelcomeImage[]>> {
    const images = await this.welcomeImagesRepository.find({
      order: { order: 'ASC' },
    });

    return returnResponse(200, SUCCESS_MESSAGES.WELCOME_IMAGES_FOUND, images);
  }

  async create(
    createDto: CreateWelcomeImageDto,
  ): Promise<ApiResponse<WelcomeImage>> {
    const image = this.welcomeImagesRepository.create(createDto);
    const savedImage = await this.welcomeImagesRepository.save(image);

    return returnResponse(
      201,
      SUCCESS_MESSAGES.WELCOME_IMAGE_CREATED,
      savedImage,
    );
  }

  async update(
    id: number,
    updateDto: UpdateWelcomeImageDto,
  ): Promise<ApiResponse<WelcomeImage>> {
    const image = await this.welcomeImagesRepository.findOne({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException(ERROR_MESSAGES.WELCOME_IMAGE_NOT_FOUND(id));
    }

    const updatedImage = await this.welcomeImagesRepository.save({
      ...image,
      ...updateDto,
    });

    return returnResponse(
      200,
      SUCCESS_MESSAGES.WELCOME_IMAGE_UPDATED,
      updatedImage,
    );
  }

  async remove(id: number): Promise<ApiResponse<WelcomeImage>> {
    const image = await this.welcomeImagesRepository.findOne({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException(ERROR_MESSAGES.WELCOME_IMAGE_NOT_FOUND(id));
    }

    await this.welcomeImagesRepository.remove(image);

    return returnResponse(
      200,
      SUCCESS_MESSAGES.WELCOME_IMAGE_DELETED(id),
      image,
    );
  }
}
