import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanModule } from './plan/plan.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ScheduleTypeModule } from './schedule-type/schedule-type.module';
import { ShareModule } from './share/share.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';

@Module({
  imports: [
    PlanModule,
    ScheduleModule,
    ScheduleTypeModule,
    ShareModule,
    TypeOrmModule.forRoot(typeORMConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
