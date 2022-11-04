import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Schedule } from 'src/entities/schedule.entity';
import { Share } from 'src/entities/share.entity';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';
import { isEmpty } from 'lodash';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';
import { Plan } from 'src/entities/plan.entity';

@Injectable()
export class ScheduleService {
  getSchedules(): Promise<Schedule[]> {
    return getRepository(Schedule).createQueryBuilder().getMany();
  }

  async getSchedulesByPlanId(user: User, planId: number): Promise<Schedule[]> {
    const foundPlan = await getRepository(Plan)
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.createdBy', 'createdBy')
      .where('plan.id = :id', { id: planId })
      .getOne();

    if (!foundPlan) {
      throw new NotFoundException();
    } else if (
      foundPlan.createdBy.id !== user.id &&
      !user.shares.some(({ plan: { id } }) => id === planId)
    ) {
      throw new UnauthorizedException('읽기 권한이 없는 유저의 요청입니다.');
    }
    return getRepository(Schedule)
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.createdBy', 'createdBy')
      .leftJoinAndSelect('schedule.scheduleType', 'scheduleType')
      .where('schedule.planId = :planId', { planId })
      .getMany();
  }

  async getSchedule(user: User, id: number): Promise<Schedule> {
    const foundSchedule = await getRepository(Schedule)
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.createdBy', 'createdBy')
      .leftJoinAndSelect('schedule.plan', 'plan')
      .leftJoinAndSelect('plan.createdBy', 'planCreator')
      .leftJoinAndSelect('schedule.scheduleType', 'scheduleType')
      .where('schedule.id = :id', { id })
      .getOne();

    const planId = foundSchedule.plan.id;

    if (!foundSchedule) {
      throw new NotFoundException();
    } else if (
      foundSchedule.plan.createdBy.id !== user.id &&
      !user.shares.some(({ plan: { id } }) => id === planId)
    ) {
      throw new UnauthorizedException('읽기 권한이 없는 유저의 요청입니다.');
    }

    return foundSchedule;
  }

  async createSchedule(
    user: User,
    createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    const { description, duration, planId, scheduleTypeId, startTime, title } =
      createScheduleDto;

    const newSchedule = getRepository(Schedule).create({
      createdBy: { id: user.id },
      description,
      duration,
      plan: { id: planId },
      scheduleType: { id: scheduleTypeId },
      startTime,
      title,
    });

    await getRepository(Schedule)
      .createQueryBuilder()
      .insert()
      .into(Schedule)
      .values([newSchedule])
      .execute();

    return newSchedule;
  }

  async deleteSchedule(user: User, id: number): Promise<void> {
    const foundSchedule = await getRepository(Schedule).findOne(id, {
      relations: ['createdBy', 'plan'],
    });
    const foundShare = await getRepository(Share).find({
      member: { id: user.id },
      plan: { id: foundSchedule.plan.id },
    });

    if (!foundSchedule) {
      throw new NotFoundException();
    } else if (
      foundSchedule.plan.createdBy.id !== user.id &&
      isEmpty(foundShare)
    ) {
      throw new UnauthorizedException('삭제 권한이 없는 유저의 요청입니다.');
    }

    await getRepository(Schedule)
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  async updateSchedule(
    user: User,
    id: number,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<void> {
    const foundSchedule = await getRepository(Schedule).findOne(id, {
      relations: ['createdBy', 'plan'],
    });

    const foundShare = await getRepository(Share).find({
      member: { id: user.id },
      plan: { id: foundSchedule.plan.id },
    });

    if (!foundSchedule) {
      throw new NotFoundException();
    } else if (
      foundSchedule.plan.createdBy.id !== user.id &&
      isEmpty(foundShare)
    ) {
      throw new UnauthorizedException('수정 권한이 없는 유저의 요청입니다.');
    }

    const { description, duration, title, scheduleTypeId, startTime } =
      updateScheduleDto;

    await getRepository(Schedule)
      .createQueryBuilder()
      .update(Schedule)
      .set({
        description,
        duration,
        scheduleType: { id: scheduleTypeId },
        startTime,
        title,
      })
      .where('id = :id', { id })
      .execute();
  }
}
