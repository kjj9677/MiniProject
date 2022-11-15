import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagMapping } from 'src/entities/tagMapping.entity';
import { TagMappingController } from './tagMapping.controller';
import { TagMappingService } from './tagMapping.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagMapping])],
  exports: [TypeOrmModule],
  controllers: [TagMappingController],
  providers: [TagMappingService],
})
export class TagMappingModule {}
