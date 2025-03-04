import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';

@Module({
  imports: [],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
