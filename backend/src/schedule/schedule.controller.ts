import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
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
import { EntityNotFoundError } from 'typeorm';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getSchedules(
    @Req() { user }: { user: User },
    @Query() { planId }: { planId: number },
  ): Promise<void | Schedule[]> {
    if (!planId) {
      return this.scheduleService.getSchedules();
    }
    return this.scheduleService
      .getSchedulesByPlanId(user, planId)
      .catch((error) => {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(
            `존재하지 않는 플랜입니다. id : ${planId}`,
          );
        }
        throw new InternalServerErrorException(
          '조회 중 오류가 발생하였습니다.',
        );
      });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getSchedule(
    @Req() { user }: { user: User },
    @Param('id') id: number,
  ): Promise<void | Schedule> {
    return this.scheduleService.getSchedule(user, id).catch((error) => {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`존재하지 않는 스케줄입니다. id : ${id}`);
      }
      throw new InternalServerErrorException('조회 중 오류가 발생하였습니다.');
    });
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createSchedule(
    @Req() { user }: { user: User },
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    return this.scheduleService
      .createSchedule(user, createScheduleDto)
      .catch((error) => {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(`존재하지 않는 계획입니다. id : ${id}`);
        }
        throw new InternalServerErrorException(
          '생정 중 오류가 발생하였습니다.',
        );
      });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteSchedule(@Req() { user }: { user: User }, @Param('id') id: number) {
    return this.scheduleService
      .deleteSchedule(user, id)
      .then(() => 'Delete Success')
      .catch((error) => {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(`존재하지 않는 스케줄입니다. id : ${id}`);
        }
        throw new InternalServerErrorException(
          '삭제 중 오류가 발생하였습니다.',
        );
      });
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
      .then(() => 'Update Success')
      .catch((error) => {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(`존재하지 않는 스케줄입니다. id : ${id}`);
        }
        throw new InternalServerErrorException(
          '수정 중 오류가 발생하였습니다.',
        );
      });
  }
}
