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
    return getRepository(Schedule).find();
  }

  async getSchedulesByPlanId(user: User, planId: number): Promise<Schedule[]> {
    const foundPlan = await getRepository(Plan).findOne(planId, {
      relations: ['createdBy'],
    });

    if (!foundPlan) {
      throw new NotFoundException();
    } else if (
      foundPlan.createdBy.id !== user.id &&
      !user.shares.some(({ plan: { id } }) => id === planId)
    ) {
      throw new UnauthorizedException('읽기 권한이 없는 유저의 요청입니다.');
    }

    return getRepository(Schedule).find({
      relations: ['createdBy', 'scheduleType'],
      where: { plan: { id: planId } },
    });
  }

  async getSchedule(user: User, id: number): Promise<Schedule> {
    const foundSchedule = await getRepository(Schedule).findOne(id, {
      relations: ['createdBy', 'plan', 'scheduleType'],
    });

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

    await getRepository(Schedule).insert(newSchedule);

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

    await getRepository(Schedule).delete(id);
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
