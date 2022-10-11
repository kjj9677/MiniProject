import { Injectable, NotFoundException } from '@nestjs/common';
import { Schedule } from 'src/entities/schedule.entity';
import { getRepository } from 'typeorm';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';

@Injectable()
export class ScheduleService {
  getSchedules(): Promise<Schedule[]> {
    return getRepository(Schedule).find();
  }

  getSchedulesByPlanId(planId: number): Promise<Schedule[]> {
    return getRepository(Schedule).find({
      relations: ['createdBy', 'scheduleType'],
      where: { plan: { id: planId } },
    });
  }

  async getSchedule(id: number): Promise<Schedule> {
    const foundSchedule = await getRepository(Schedule).findOne(id, {
      relations: ['createdBy', 'plan', 'scheduleType'],
    });
    if (!foundSchedule) {
      throw new NotFoundException();
    }

    return foundSchedule;
  }

  async createSchedule(createScheduleDto: CreateScheduleDto): Promise<void> {
    const {
      userId,
      description,
      duration,
      planId,
      scheduleTypeId,
      startTime,
      title,
    } = createScheduleDto;

    const newSchedule = getRepository(Schedule).create({
      createdBy: { id: userId },
      description,
      duration,
      plan: { id: planId },
      scheduleType: { id: scheduleTypeId },
      startTime,
      title,
    });

    await getRepository(Schedule).insert(newSchedule);
  }

  async deleteSchedule(id: number): Promise<void> {
    const foundSchedule = await getRepository(Schedule).findOne(id);
    if (!foundSchedule) {
      throw new NotFoundException();
    }
    await getRepository(Schedule).delete(id);
  }

  async updateSchedule(
    id: number,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<void> {
    const foundSchedule = await getRepository(Schedule).findOne(id);
    if (!foundSchedule) {
      throw new NotFoundException();
    }
    await getRepository(Schedule).update(
      { id },
      {
        description: updateScheduleDto.description,
        duration: updateScheduleDto.duration,
        title: updateScheduleDto.title,
        scheduleType: { id: updateScheduleDto.scheduleTypeId },
        startTime: updateScheduleDto.startTime,
      },
    );
  }
}
