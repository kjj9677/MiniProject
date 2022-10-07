import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/entities/plan.entity';
import { Schedule } from 'src/entities/schedule.entity';
import { getConnection, getRepository, Repository } from 'typeorm';
import { CreatePlanDto } from './plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  getPlans(): Promise<Plan[]> {
    return this.planRepository.find();
  }

  async getPlan(id: number) {
    const schedules = await getRepository(Schedule).find({
      where: { plan: { id: id } },
    });
    return { ...(await this.planRepository.findOne(id)), schedules };
  }

  async createPlan(createPlanDto: CreatePlanDto): Promise<void> {
    await this.planRepository.save(createPlanDto);
  }

  async deletePlan(id: number): Promise<void> {
    await this.planRepository.delete(id);
  }

  async updatePlan(id: number, plan: Plan): Promise<void> {
    const prevPlan = await this.getPlan(id);
    if (prevPlan) {
      await getConnection()
        .createQueryBuilder()
        .update(Plan)
        .set({
          createdBy: plan.createdBy,
          destination: plan.destination,
          period: plan.period,
          title: plan.title,
        })
        .where('id = :id', { id })
        .execute();
    }
  }
}
