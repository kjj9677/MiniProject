import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Schedule } from 'src/entities/schedule.entity';
import { CreateScheduleDto } from './schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  getSchedules(): Promise<Schedule[]> {
    return this.scheduleService.getSchedules();
  }

  @Get(':id')
  getSchedule(@Param('id') id: number): Promise<Schedule> {
    return this.scheduleService.getSchedule(id);
  }

  @Post()
  createSchedule(@Body() schedule: CreateScheduleDto) {
    return this.scheduleService.createSchedule(schedule);
  }

  @Delete(':id')
  deleteSchedule(@Param('id') id: number) {
    return this.scheduleService.deleteSchedule(id);
  }

  @Put(':id')
  updateSchedule(@Param('id') id: number, @Body() schedule: Schedule) {
    return this.scheduleService.updateSchedule(id, schedule);
  }
}
