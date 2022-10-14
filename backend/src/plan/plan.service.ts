import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Plan } from 'src/entities/plan.entity';
import { Share } from 'src/entities/share.entity';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';
import { isEmpty } from 'lodash';
import { CreatePlanDto, UpdatePlanDto } from './plan.dto';

@Injectable()
export class PlanService {
  getPlans(): Promise<Plan[]> {
    return getRepository(Plan).find();
  }

  async getPlan(id: number) {
    const foundPlan = await getRepository(Plan).findOne(id, {
      relations: ['createdBy', 'schedules'],
    });
    if (!foundPlan) {
      throw new NotFoundException();
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

    await getRepository(Plan).insert(newPlan);

    return newPlan;
  }

  async deletePlan(user: User, id: number): Promise<void> {
    const foundPlan = await getRepository(Plan).findOne(id, {
      relations: ['createdBy'],
    });

    if (!foundPlan) {
      throw new NotFoundException('존재하지 않는 플랜입니다.');
    } else if (foundPlan.createdBy.id !== user.id) {
      throw new UnauthorizedException('삭제 권한이 없는 유저의 요청입니다.');
    }

    await getRepository(Plan).softDelete(id);
  }

  async updatePlan(
    user: User,
    id: number,
    updatePlanDto: UpdatePlanDto,
  ): Promise<void> {
    const foundPlan = await getRepository(Plan).findOne(id, {
      relations: ['createdBy'],
    });

    const foundShare = await getRepository(Share).find({
      member: { id: user.id },
      plan: { id },
    });

    if (!foundPlan) {
      throw new NotFoundException('존재하지 않는 플랜입니다.');
    } else if (foundPlan.createdBy.id !== user.id && isEmpty(foundShare)) {
      throw new UnauthorizedException('수정 권한이 없는 유저의 요청입니다.');
    }

    await getRepository(Plan).update({ id }, updatePlanDto);
  }
}
