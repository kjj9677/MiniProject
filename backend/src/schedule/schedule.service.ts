import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Schedule } from 'src/entities/schedule.entity';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';
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
      .getOneOrFail();

    if (
      !this.checkUserIsPlanCreator(foundPlan, user) &&
      !this.checkUserIsMember(foundPlan, user)
    ) {
      throw new ForbiddenException('읽기 권한이 없는 유저의 요청입니다.');
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
      .getOneOrFail();

    if (
      this.checkUserIsPlanCreator(foundSchedule.plan, user) &&
      this.checkUserIsMember(foundSchedule.plan, user)
    ) {
      throw new ForbiddenException('읽기 권한이 없는 유저의 요청입니다.');
    }

    return foundSchedule;
  }

  async createSchedule(
    user: User,
    createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    const { description, duration, planId, scheduleTypeId, startTime, title } =
      createScheduleDto;

    const foundPlan = await getRepository(Plan)
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.createdBy', 'createdBy')
      .leftJoinAndSelect('plan.schedules', 'schedule')
      .where('plan.id = :id', { id: planId })
      .getOneOrFail();

    const newSchedule = getRepository(Schedule).create({
      createdBy: { id: user.id },
      description,
      duration,
      plan: { id: planId },
      scheduleType: { id: scheduleTypeId },
      startTime,
      title,
    });

    if (
      this.checkUserIsPlanCreator(foundPlan, user) &&
      this.checkUserIsMember(foundPlan, user)
    ) {
      throw new ForbiddenException('생성 권한이 없는 유저의 요청입니다.');
    } else if (
      this.checkScheduleIsConflicting(foundPlan.schedules, newSchedule)
    ) {
      throw new ConflictException('기존 스케줄과 충돌이 있습니다.');
    }

    await getRepository(Schedule)
      .createQueryBuilder()
      .insert()
      .into(Schedule)
      .values([newSchedule])
      .execute();

    return newSchedule;
  }

  async deleteSchedule(user: User, id: number): Promise<void> {
    const foundSchedule = await getRepository(Schedule).findOneOrFail(id, {
      relations: ['createdBy', 'plan'],
    });

    if (
      this.checkUserIsPlanCreator(foundSchedule.plan, user) &&
      this.checkUserIsMember(foundSchedule.plan, user)
    ) {
      throw new ForbiddenException('삭제 권한이 없는 유저의 요청입니다.');
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
    const foundSchedule = await getRepository(Schedule).findOneOrFail(id, {
      relations: ['createdBy', 'plan'],
    });

    if (
      this.checkUserIsPlanCreator(foundSchedule.plan, user) &&
      this.checkUserIsMember(foundSchedule.plan, user)
    ) {
      throw new ForbiddenException('수정 권한이 없는 유저의 요청입니다.');
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

  private checkUserIsPlanCreator(plan: Plan, user: User) {
    return plan.createdBy.id === user.id;
  }

  private checkUserIsMember(plan: Plan, user: User) {
    return user.shares.some(({ plan: { id } }) => id === plan.id);
  }

  private checkScheduleIsConflicting(
    prevSchedules: Schedule[],
    newSchedule: Schedule,
  ) {
    return prevSchedules.some(
      (prevSchedule) =>
        (newSchedule.startTime < prevSchedule.startTime &&
          newSchedule.startTime + newSchedule.duration >
            prevSchedule.startTime) ||
        newSchedule.startTime === prevSchedule.startTime ||
        (newSchedule.startTime > prevSchedule.startTime &&
          prevSchedule.startTime + prevSchedule.duration >
            newSchedule.startTime),
    );
  }
}
