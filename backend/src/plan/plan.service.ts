import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/entities/plan.entity';
import { Schedule } from 'src/entities/schedule.entity';
import { getConnection, getRepository, Repository } from 'typeorm';
import { CreatePlanDto, UpdatePlanDto } from './plan.dto';

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
    const foundPlan = await this.planRepository.findOne(id);
    if (!foundPlan) {
      throw new NotFoundException();
    }

    const schedules = await getRepository(Schedule).find({
      where: { plan: { id: id } },
    });
    return { ...foundPlan, schedules };
  }

  async createPlan(createPlanDto: CreatePlanDto): Promise<void> {
    const { destination, period, title, userId } = createPlanDto;

    const newSchedule = {
      createdBy: { id: userId },
      destination,
      period,
      title,
      userId,
    };
    await this.planRepository.save(newSchedule);
  }

  async deletePlan(id: number): Promise<void> {
    const foundPlan = await this.planRepository.findOne(id);
    if (!foundPlan) {
      throw new NotFoundException();
    }

    await this.planRepository.delete(id);
  }

  async updatePlan(id: number, updatePlanDto: UpdatePlanDto): Promise<void> {
    const foundPlan = await this.planRepository.findOne(id);
    if (!foundPlan) {
      throw new NotFoundException();
    }

    await getConnection()
      .createQueryBuilder()
      .update(Plan)
      .set({
        destination: updatePlanDto.destination,
        period: updatePlanDto.period,
        title: updatePlanDto.title,
      })
      .where('id = :id', { id })
      .execute();
  }
}
