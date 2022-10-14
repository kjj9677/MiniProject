import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Plan } from 'src/entities/plan.entity';
import { Share } from 'src/entities/share.entity';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';
import { CreateShareDto } from './share.dto';

@Injectable()
export class ShareService {
  getShares(): Promise<Share[]> {
    return getRepository(Share).find();
  }

  async getShare(id: number): Promise<Share> {
    const foundShare = await getRepository(Share).findOne(id);
    if (!foundShare) {
      throw new NotFoundException('존재하지 않는 공유입니다.');
    }
    return foundShare;
  }

  async createShare(
    user: User,
    createShareDto: CreateShareDto,
  ): Promise<Share> {
    const { memberKakaoId, planId } = createShareDto;
    const foundPlan = await getRepository(Plan).findOne(planId, {
      relations: ['createdBy'],
    });

    if (!foundPlan) {
      throw new NotFoundException('존재하지 않는 플랜입니다.');
    } else if (foundPlan.createdBy.id !== user.id) {
      throw new UnauthorizedException('공유 권한이 없는 유저의 요청입니다.');
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
    await getRepository(Share).insert(newShare);

    return newShare;
  }

  async deleteShare(user: User, id: number): Promise<void> {
    const foundShare = await getRepository(Share).findOne(id, {
      relations: ['member', 'plan'],
    });
    if (!foundShare) {
      throw new NotFoundException('존재하지 않는 공유입니다.');
    } else if (foundShare.member.id !== user.id) {
      throw new UnauthorizedException('삭제 권한이 없는 유저의 요청입니다.');
    }

    await getRepository(Share).delete(id);
  }
}
