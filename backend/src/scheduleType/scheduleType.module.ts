import { Module } from '@nestjs/common';
import { ScheduleTypeService } from './scheduleType.service';
import { ScheduleTypeController } from './scheduleType.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleType } from 'src/entities/scheduleType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleType])],
  exports: [TypeOrmModule],
  providers: [ScheduleTypeService],
  controllers: [ScheduleTypeController],
})
export class ScheduleTypeModule {}
