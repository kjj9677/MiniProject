import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Plan } from 'src/entities/plan.entity';
import { CreatePlanDto, UpdatePlanDto } from './plan.dto';
import { PlanService } from './plan.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';

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
  @UseGuards(AuthGuard('jwt'))
  createPlan(
    @Req() { user }: { user: User },
    @Body() createPlanDto: CreatePlanDto,
  ): Promise<Plan> {
    return this.planService.createPlan(user, createPlanDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deletePlan(@Req() { user }: { user: User }, @Param('id') id: number) {
    return this.planService.deletePlan(user, id).then(() => 'Delete Success');
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Req() { user }: { user: User },
    @Param('id') id: number,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    return this.planService
      .updatePlan(user, id, updatePlanDto)
      .then(() => 'Update Success');
  }
}
