import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/entities/plan.entity';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  exports: [TypeOrmModule],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
