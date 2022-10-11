import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/entities/schedule.entity';
import { getConnection, Repository } from 'typeorm';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  getSchedules(): Promise<Schedule[]> {
    return this.scheduleRepository.find();
  }

  getSchedulesByPlanId(planId: number): Promise<Schedule[]> {
    return this.scheduleRepository.find({ where: { plan: { id: planId } } });
  }

  getSchedule(id: number): Promise<Schedule> {
    return this.scheduleRepository.findOne(id);
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

    const newSchedule = {
      createdBy: { id: userId },
      description,
      duration,
      plan: { id: planId },
      scheduleType: { id: scheduleTypeId },
      startTime,
      title,
    };
    await this.scheduleRepository.save(newSchedule);
  }

  async deleteSchedule(id: number): Promise<void> {
    await this.scheduleRepository.delete(id);
  }

  async updateSchedule(
    id: number,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<void> {
    const prevSchedule = await this.getSchedule(id);
    if (prevSchedule) {
      await getConnection()
        .createQueryBuilder()
        .update(Schedule)
        .set({
          description: updateScheduleDto.description,
          duration: updateScheduleDto.duration,
          title: updateScheduleDto.title,
          scheduleType: { id: updateScheduleDto.scheduleTypeId },
          startTime: updateScheduleDto.startTime,
        })
        .where('id = :id', { id })
        .execute();
    }
  }
}
