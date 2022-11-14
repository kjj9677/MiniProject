import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Payment } from 'src/entities/payment.entity';
import { Plan } from 'src/entities/plan.entity';
import { Schedule } from 'src/entities/schedule.entity';
import { User } from 'src/entities/user.entity';
import { getRepository, QueryFailedError } from 'typeorm';

@Injectable()
export class PaymentService {
  async createPayment(user: User, createPaymentDto): Promise<Payment> {
    const { memberId, scheduleId } = createPaymentDto;
    const foundSchedule = await getRepository(Schedule).findOneOrFail(
      scheduleId,
      { relations: ['plan.createdBy'] },
    );

    if (
      !this.checkUserIsPlanCreator(foundSchedule.plan, user) &&
      !this.checkUserIsMember(foundSchedule.plan, user)
    ) {
      throw new ForbiddenException('지출 생성 권한이 없는 유저의 요청입니다.');
    }

    const foundMember = await getRepository(User).findOneOrFail(memberId);

    if (
      !this.checkUserIsPlanCreator(foundSchedule.plan, foundMember) &&
      !this.checkUserIsMember(foundSchedule.plan, foundMember)
    ) {
      throw new BadRequestException('이번 여행에 포함되지 않은 유저입니다.');
    }

    const newPayment = getRepository(Payment).create({
      member: { id: memberId },
      schedule: { id: scheduleId },
    });

    await getRepository(Payment)
      .insert(newPayment)
      .catch((e) => {
        if (e instanceof QueryFailedError) {
          throw new ConflictException('이미 추가된 유저입니다.');
        }
      });

    return newPayment;
  }

  private checkUserIsPlanCreator(plan: Plan, user: User) {
    return plan.createdBy.id === user.id;
  }

  private checkUserIsMember(plan: Plan, user: User) {
    return user.shares.some(({ plan: { id } }) => id === plan.id);
  }
}
