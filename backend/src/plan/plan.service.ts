import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/entities/plan.entity';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  getPlans(): Promise<Plan[]> {
    return this.planRepository.find();
  }

  getPlan(id: number): Promise<Plan> {
    return this.planRepository.findOne(id);
  }

  async createPlan(plan: Plan): Promise<void> {
    await this.planRepository.save(plan);
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
