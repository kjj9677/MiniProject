import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/entities/schedule.entity';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  getSchedules(): Promise<Schedule[]> {
    return this.scheduleRepository.find();
  }

  getSchedule(id: number): Promise<Schedule> {
    return this.scheduleRepository.findOne(id);
  }

  async createSchedule(schedule: Schedule): Promise<void> {
    await this.scheduleRepository.save(schedule);
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
