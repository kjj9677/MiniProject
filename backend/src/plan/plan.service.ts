import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Plan } from 'src/entities/plan.entity';
import { Share } from 'src/entities/share.entity';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';
import { isEmpty } from 'lodash';
import { CreatePlanDto, UpdatePlanDto } from './plan.dto';
import { Schedule } from 'src/entities/schedule.entity';

@Injectable()
export class PlanService {
  async getPlans(user: User): Promise<Plan[]> {
    const createdPlans = await getRepository(Plan)
      .createQueryBuilder('plan')
      .where('plan.createdById = :id', { id: user.id })
      .getMany();

    const sharedPlans = user.shares.map(({ plan }: Share) => plan);

    return createdPlans.concat(sharedPlans);
  }

  async getPlan(user: User, id: number): Promise<Plan> {
    const foundPlan = await getRepository(Plan)
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.createdBy', 'createdBy')
      .leftJoinAndSelect('plan.schedules', 'schedule')
      .where('plan.id = :id', { id })
      .getOneOrFail();

    if (
      !this.checkUserIsCreator(foundPlan, user) &&
      !this.checkUserIsMember(foundPlan, user)
    ) {
      throw new ForbiddenException('읽기 권한이 없는 유저의 요청입니다.');
    }

    return foundPlan;
  }

  async createPlan(user: User, createPlanDto: CreatePlanDto): Promise<Plan> {
    const { destination, period, title } = createPlanDto;
    const newPlan = getRepository(Plan).create({
      createdBy: { id: user.id },
      destination,
      period,
      title,
    });

    await getRepository(Plan)
      .createQueryBuilder()
      .insert()
      .into(Plan)
      .values([newPlan])
      .execute();

    return newPlan;
  }

  async deletePlan(user: User, id: number): Promise<void> {
    const foundPlan = await getRepository(Plan)
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.createdBy', 'createdBy')
      .where('id = :id', { id })
      .getOneOrFail();

    if (!this.checkUserIsCreator(foundPlan, user)) {
      throw new UnauthorizedException('삭제 권한이 없는 유저의 요청입니다.');
    }

    await getRepository(Schedule)
      .createQueryBuilder()
      .delete()
      .from(Schedule)
      .where('"planId" = :id', { id })
      .execute();

    await getRepository(Share)
      .createQueryBuilder()
      .delete()
      .from(Share)
      .where('"planId" = :id', { id })
      .execute();

    await getRepository(Plan).softDelete(id);
  }

  async updatePlan(
    user: User,
    id: number,
    updatePlanDto: UpdatePlanDto,
  ): Promise<void> {
    const foundPlan = await getRepository(Plan).findOneOrFail(id, {
      relations: ['createdBy'],
    });

    if (
      !this.checkUserIsCreator(foundPlan, user) &&
      !this.checkUserIsMember(foundPlan, user)
    ) {
      throw new UnauthorizedException('수정 권한이 없는 유저의 요청입니다.');
    }

    await getRepository(Plan)
      .createQueryBuilder()
      .update(Plan)
      .set(updatePlanDto)
      .where('id = :id', { id })
      .execute();
  }

  private checkUserIsCreator(plan: Plan, user: User) {
    return plan.createdBy.id === user.id;
  }

  private async checkUserIsMember(plan: Plan, user: User) {
    const foundShare = await getRepository(Share)
      .createQueryBuilder('share')
      .where('share.planId = :planId', { planId: plan.id })
      .andWhere('share.memberId = :memberId', { memberId: user.id })
      .getOne();

    return !isEmpty(foundShare);
  }
}
