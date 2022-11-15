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
import { RoleModule } from './role/role.module';
import { PaymentModule } from './payment/payment.module';
import { TagModule } from './tag/tag.module';
import { TagMappingModule } from './tagMapping/tagMapping.module';

@Module({
  imports: [
    PlanModule,
    ScheduleModule,
    ScheduleTypeModule,
    ShareModule,
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    AuthModule,
    RoleModule,
    PaymentModule,
    TagModule,
    TagMappingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
