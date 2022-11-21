import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorator/role.decorator';
import { USER_ROLE } from 'src/entities/role.entity';
import { Tag } from 'src/entities/tag.entity';
import { RoleGuard } from 'src/guard/role.guard';
import { CreateTagDto, UpdateTagDto } from './tag.dto';
import { TagService } from './tag.service';

@Controller('tags')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles(USER_ROLE.ADMIN)
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  @Roles(USER_ROLE.GUEST)
  getTags(): Promise<Tag[]> {
    return this.tagService.getTags();
  }

  @Get(':id')
  getTag(@Param('id') id: number): Promise<Tag> {
    return this.tagService.getTag(id);
  }

  @Post()
  createTag(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagService.createTag(createTagDto);
  }

  @Delete(':id')
  deleteTag(@Param('id') id: number) {
    return this.tagService.deleteTag(id);
  }

  @Put(':id')
  async updateTag(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService
      .updateTag(id, updateTagDto)
      .then(() => 'Update Success');
  }
}
