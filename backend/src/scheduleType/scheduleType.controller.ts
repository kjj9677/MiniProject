import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ScheduleType } from 'src/entities/scheduleType.entity';
import { ScheduleTypeService } from './scheduleType.service';

@Controller('types')
export class ScheduleTypeController {
  constructor(private scheduleTypeService: ScheduleTypeService) {}

  @Get()
  getScheduleTypes(): Promise<ScheduleType[]> {
    return this.scheduleTypeService.getScheduleTypes();
  }

  @Get(':id')
  getScheduleType(@Param('id') id: number): Promise<ScheduleType> {
    return this.scheduleTypeService.getScheduleType(id);
  }

  @Post()
  createScheduleType(@Body() scheduleType: ScheduleType) {
    return this.scheduleTypeService.createScheduleType(scheduleType);
  }

  @Delete(':id')
  deleteScheduleType(@Param('id') id: number) {
    return this.scheduleTypeService.deleteScheduleType(id);
  }

  @Put(':id')
  updateScheduleType(
    @Param('id') id: number,
    @Body() scheduleType: ScheduleType,
  ) {
    return this.scheduleTypeService.updateScheduleType(id, scheduleType);
  }
}
