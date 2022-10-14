import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Schedule } from 'src/entities/schedule.entity';
import { User } from 'src/entities/user.entity';
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
  @UseGuards(AuthGuard('jwt'))
  createSchedule(
    @Req() { user }: { user: User },
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    return this.scheduleService.createSchedule(user, createScheduleDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteSchedule(@Req() { user }: { user: User }, @Param('id') id: number) {
    return this.scheduleService
      .deleteSchedule(user, id)
      .then(() => 'Delete Success');
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updateSchedule(
    @Req() { user }: { user: User },
    @Param('id') id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService
      .updateSchedule(user, id, updateScheduleDto)
      .then(() => 'Update Success');
  }
}
