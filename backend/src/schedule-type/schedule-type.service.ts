import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleType } from 'src/entities/scheduleType.entity';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class ScheduleTypeService {
  constructor(
    @InjectRepository(ScheduleType)
    private scheduleTypeRepository: Repository<ScheduleType>,
  ) {}

  getScheduleTypes(): Promise<ScheduleType[]> {
    return this.scheduleTypeRepository.find();
  }

  async getScheduleType(id: number): Promise<ScheduleType> {
    const foundScheduleType = await this.scheduleTypeRepository.findOne(id);
    if (!foundScheduleType) {
      throw new NotFoundException();
    }
    return this.scheduleTypeRepository.findOne(id);
  }

  async createScheduleType(scheduleType: ScheduleType): Promise<void> {
    await this.scheduleTypeRepository.save(scheduleType);
  }

  async deleteScheduleType(id: number): Promise<void> {
    const foundScheduleType = await this.scheduleTypeRepository.findOne(id);
    if (!foundScheduleType) {
      throw new NotFoundException();
    }
    await this.scheduleTypeRepository.delete(id);
  }

  async updateScheduleType(
    id: number,
    scheduleType: ScheduleType,
  ): Promise<void> {
    const prevScheduleType = await this.getScheduleType(id);
    if (prevScheduleType) {
      await getConnection()
        .createQueryBuilder()
        .update(ScheduleType)
        .set({
          title: scheduleType.title,
        })
        .where('id = :id', { id })
        .execute();
    }
  }
}
