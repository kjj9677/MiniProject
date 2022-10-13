import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanModule } from './plan/plan.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ScheduleTypeModule } from './scheduleType/scheduleType.module';
import { ShareModule } from './share/share.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PlanModule,
    ScheduleModule,
    ScheduleTypeModule,
    ShareModule,
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
