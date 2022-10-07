import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Plan } from 'src/entities/plan.entity';
import { CreatePlanDto } from './plan.dto';
import { PlanService } from './plan.service';

@Controller('plans')
export class PlanController {
  constructor(private planService: PlanService) {}

  @Get()
  getPlans(): Promise<Plan[]> {
    return this.planService.getPlans();
  }

  @Get(':id')
  getPlan(@Param('id') id: number) {
    return this.planService.getPlan(id);
  }

  @Post()
  createPlan(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.createPlan(createPlanDto);
  }

  @Delete(':id')
  deletePlan(@Param('id') id: number) {
    return this.planService.deletePlan(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() plan: Plan) {
    return this.planService.updatePlan(id, plan);
  }
}
