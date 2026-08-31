import { PartialType } from '@nestjs/mapped-types';
import { CreateWelcomeImageDto } from './create-welcome-image.dto';

export class UpdateWelcomeImageDto extends PartialType(CreateWelcomeImageDto) {}
