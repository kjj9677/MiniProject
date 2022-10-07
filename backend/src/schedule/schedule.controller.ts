import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Schedule } from 'src/entities/schedule.entity';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  getSchedules(@Query() query: { planId: number }): Promise<Schedule[]> {
    const { planId } = query;

    if (!planId) {
      return this.scheduleService.getSchedules();
    }
    return this.scheduleService.getSchedulesByPlanId(planId);
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
  updateSchedule(
    @Param('id') id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.updateSchedule(id, updateScheduleDto);
  }
}
