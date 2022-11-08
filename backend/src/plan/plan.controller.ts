import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
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
import { EntityNotFoundError } from 'typeorm';

@Controller('plans')
export class PlanController {
  constructor(private planService: PlanService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getPlans(@Req() { user }: { user: User }): Promise<Plan[]> {
    return this.planService.getPlans(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getPlan(
    @Req() { user }: { user: User },
    @Param('id') id: number,
  ): Promise<void | Plan> {
    return this.planService.getPlan(user, id).catch((error) => {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`존재하지 않는 플랜입니다. id : ${id}`);
      }
      throw new InternalServerErrorException('조회 중 오류가 발생하였습니다.');
    });
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
    return this.planService
      .deletePlan(user, id)
      .then(() => 'Delete Success')
      .catch((error) => {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(`존재하지 않는 플랜입니다. id : ${id}`);
        }
        throw new InternalServerErrorException(
          '삭제 중 오류가 발생하였습니다.',
        );
      });
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
      .then(() => 'Update Success')
      .catch((error) => {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(`존재하지 않는 플랜입니다. id : ${id}`);
        }
        throw new InternalServerErrorException(
          '수정 중 오류가 발생하였습니다.',
        );
      });
  }
}
