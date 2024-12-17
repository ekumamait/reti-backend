import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspirationsController } from './inspirations.controller';
import { InspirationsService } from './inspirations.service';
import { Inspiration } from '../database/entities/inspiration.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../authentication/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inspiration]), UsersModule, AuthModule],
  controllers: [InspirationsController],
  providers: [InspirationsService],
  exports: [InspirationsService],
})
export class InspirationsModule {}
