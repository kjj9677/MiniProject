import { Injectable, NotFoundException } from '@nestjs/common';
import { Plan } from 'src/entities/plan.entity';
import { getRepository } from 'typeorm';
import { CreatePlanDto, UpdatePlanDto } from './plan.dto';

@Injectable()
export class PlanService {
  getPlans(): Promise<Plan[]> {
    return getRepository(Plan).find();
  }

  async getPlan(id: number) {
    const foundPlan = await getRepository(Plan).findOne(id, {
      relations: ['schedules'],
    });
    if (!foundPlan) {
      throw new NotFoundException();
    }

    return foundPlan;
  }

  async createPlan(createPlanDto: CreatePlanDto): Promise<void> {
    const { destination, period, title, userId } = createPlanDto;
    const newPlan = getRepository(Plan).create({
      createdBy: { id: userId },
      destination,
      period,
      title,
    });

    await getRepository(Plan).insert(newPlan);
  }

  async deletePlan(id: number): Promise<void> {
    const foundPlan = await getRepository(Plan).findOne(id);
    if (!foundPlan) {
      throw new NotFoundException();
    }

    await getRepository(Plan).softDelete(id);
  }

  async updatePlan(id: number, updatePlanDto: UpdatePlanDto): Promise<void> {
    const foundPlan = await getRepository(Plan).findOne(id);
    if (!foundPlan) {
      throw new NotFoundException();
    }

    await getRepository(Plan).update(
      { id },
      {
        destination: updatePlanDto.destination,
        period: updatePlanDto.period,
        title: updatePlanDto.title,
      },
    );
  }
}
