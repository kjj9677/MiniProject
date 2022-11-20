import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleType } from 'src/entities/scheduleType.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class ScheduleTypeService {
  getScheduleTypes(): Promise<ScheduleType[]> {
    return getRepository(ScheduleType).find();
  }

  async getScheduleType(id: number): Promise<ScheduleType> {
    const foundScheduleType = await getRepository(ScheduleType).findOne(id);
    if (!foundScheduleType) {
      throw new NotFoundException();
    }
    return foundScheduleType;
  }

  async createScheduleType(scheduleType: { title: string }): Promise<void> {
    await getRepository(ScheduleType).insert(scheduleType);
  }

  async deleteScheduleType(id: number): Promise<void> {
    const foundScheduleType = await getRepository(ScheduleType).findOne(id);
    if (!foundScheduleType) {
      throw new NotFoundException();
    }
    await getRepository(ScheduleType).delete(id);
  }

  async updateScheduleType(
    id: number,
    scheduleType: ScheduleType,
  ): Promise<void> {
    const prevScheduleType = await this.getScheduleType(id);
    if (prevScheduleType) {
      await getRepository(ScheduleType)
        .createQueryBuilder()
        .update(ScheduleType)
        .set({
          title: scheduleType.title,
        })
        .where('id = :id', { id })
        .execute();
    }

    throw new NotFoundException();
  }
}
