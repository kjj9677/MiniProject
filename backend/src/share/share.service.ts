import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Plan } from 'src/entities/plan.entity';
import { Share } from 'src/entities/share.entity';
import { User } from 'src/entities/user.entity';
import { getRepository, QueryFailedError } from 'typeorm';
import { CreateShareDto } from './share.dto';

@Injectable()
export class ShareService {
  getShares(): Promise<Share[]> {
    return getRepository(Share).find();
  }

  async getShare(id: number): Promise<Share> {
    const foundShare = await getRepository(Share).findOneOrFail(id);
    return foundShare;
  }

  async createShare(
    user: User,
    createShareDto: CreateShareDto,
  ): Promise<Share> {
    const { memberKakaoId, planId } = createShareDto;
    const foundPlan = await getRepository(Plan).findOneOrFail(planId, {
      relations: ['createdBy'],
    });

    if (
      !this.checkUserIsPlanCreator(foundPlan, user) &&
      !this.checkUserIsMember(foundPlan, user)
    ) {
      throw new ForbiddenException('공유 권한이 없는 유저의 요청입니다.');
    }

    let memberId: number;
    const foundMember = await getRepository(User).findOne({
      kakaoId: memberKakaoId,
    });

    if (!foundMember) {
      const newMember = getRepository(User).create({ kakaoId: memberKakaoId });
      await getRepository(User).insert(newMember);
      memberId = newMember.id;
    } else {
      memberId = foundMember.id;
    }

    const newShare = getRepository(Share).create({
      member: { id: memberId },
      plan: { id: planId },
    });

    await getRepository(Share)
      .insert(newShare)
      .catch((e) => {
        if (e instanceof QueryFailedError) {
          throw new ConflictException('이미 공유한 유저입니다.');
        }
      });

    return newShare;
  }

  async deleteShare(user: User, id: number): Promise<void> {
    const foundShare = await getRepository(Share).findOneOrFail(id, {
      relations: ['member', 'plan'],
    });
    if (!this.checkUserIsMember(foundShare.plan, user)) {
      throw new ForbiddenException('삭제 권한이 없는 유저의 요청입니다.');
    }

    await getRepository(Share).delete(id);
  }

  private checkUserIsPlanCreator(plan: Plan, user: User) {
    return plan.createdBy.id === user.id;
  }

  private checkUserIsMember(plan: Plan, user: User) {
    return user.shares.some(({ plan: { id } }) => id === plan.id);
  }
}
