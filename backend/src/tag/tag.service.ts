import { Injectable } from '@nestjs/common';
import { Tag } from 'src/entities/tag.entity';
import { TagMapping } from 'src/entities/tagMapping.entity';
import { getRepository } from 'typeorm';
import { CreateTagDto, UpdateTagDto } from './tag.dto';

@Injectable()
export class TagService {
  getTags(): Promise<Tag[]> {
    return getRepository(Tag).find();
  }

  async getTag(id: number): Promise<Tag> {
    const foundTag = await getRepository(Tag).findOneOrFail(id);
    return foundTag;
  }

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const newTag = getRepository(Tag).create(createTagDto);
    await getRepository(Tag).insert(newTag);
    return newTag;
  }

  async deleteTag(id: number): Promise<void> {
    await getRepository(Tag).findOneOrFail(id);
    await getRepository(TagMapping)
      .createQueryBuilder()
      .delete()
      .from(TagMapping)
      .where('"tagId" = :id', { id })
      .execute();
    await getRepository(Tag).delete(id);
  }

  async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<void> {
    await getRepository(Tag)
      .createQueryBuilder()
      .update(Tag)
      .set({
        title: updateTagDto.title,
      })
      .where('id = :id', { id })
      .execute();
  }
}
