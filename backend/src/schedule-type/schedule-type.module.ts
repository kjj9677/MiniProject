import { Module } from '@nestjs/common';
import { ScheduleTypeService } from './schedule-type.service';
import { ScheduleTypeController } from './schedule-type.controller';

@Module({
  providers: [ScheduleTypeService],
  controllers: [ScheduleTypeController]
})
export class ScheduleTypeModule {}
