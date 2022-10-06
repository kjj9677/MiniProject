import { Module } from '@nestjs/common';
import { ScheduleTypeService } from './schedule-type.service';
import { ScheduleTypeController } from './schedule-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleType } from 'src/entities/scheduleType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleType])],
  exports: [TypeOrmModule],
  providers: [ScheduleTypeService],
  controllers: [ScheduleTypeController],
})
export class ScheduleTypeModule {}
