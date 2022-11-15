import { ForbiddenException, Injectable } from '@nestjs/common';
import { Plan } from 'src/entities/plan.entity';
import { Tag } from 'src/entities/tag.entity';
import { TagMapping } from 'src/entities/tagMapping.entity';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';
import { CreateTagMappingDto } from './tagMapping.dto';

@Injectable()
export class TagMappingService {
  async createTagMapping(
    user: User,
    createTagMappingDto: CreateTagMappingDto,
  ): Promise<TagMapping> {
    const { planId, tagId } = createTagMappingDto;
    await getRepository(Tag).findOneOrFail(tagId);

    const foundPlan = await getRepository(Plan).findOneOrFail(planId, {
      relations: ['createdBy'],
    });

    if (!this.checkUserIsPlanCreator(foundPlan, user)) {
      throw new ForbiddenException('생성 권한이 없는 유저의 요청입니다.');
    }

    const newTagMapping = getRepository(TagMapping).create({
      plan: { id: planId },
      tag: { id: tagId },
    });

    await getRepository(TagMapping).insert(newTagMapping);
    return newTagMapping;
  }

  async deleteTagMapping(id: number): Promise<void> {
    await getRepository(TagMapping).delete(id);
  }

  private checkUserIsPlanCreator(plan: Plan, user: User) {
    return plan.createdBy.id === user.id;
  }
}
