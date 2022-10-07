import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/entities/schedule.entity';
import { getConnection, Repository } from 'typeorm';
import { CreateScheduleDto } from './schedule.dto';

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
      createdBy,
      description,
      duration,
      planId,
      scheduleTypeId,
      startTime,
      title,
    } = createScheduleDto;

    const newSchedule = {
      createdBy,
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

  async updateSchedule(id: number, schedule: Schedule): Promise<void> {
    const prevSchedule = await this.getSchedule(id);
    if (prevSchedule) {
      await getConnection()
        .createQueryBuilder()
        .update(Schedule)
        .set({
          createdBy: schedule.createdBy,
          description: schedule.description,
          duration: schedule.duration,
          plan: schedule.plan,
          title: schedule.title,
          scheduleType: schedule.scheduleType,
          startTime: schedule.startTime,
        })
        .where('id = :id', { id })
        .execute();
    }
  }
}
