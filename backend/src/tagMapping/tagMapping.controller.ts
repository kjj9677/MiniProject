import {
  Body,
  Controller,
  Delete,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TagMapping } from 'src/entities/tagMapping.entity';
import { User } from 'src/entities/user.entity';
import { EntityNotFoundError } from 'typeorm';
import { CreateTagMappingDto } from './tagMapping.dto';
import { TagMappingService } from './tagMapping.service';

@Controller('tagMappings')
@UseGuards(AuthGuard('jwt'))
export class TagMappingController {
  constructor(private tagMappingService: TagMappingService) {}

  @Post()
  async createTagMapping(
    @Req() { user }: { user: User },
    @Body() createTagMappingDto: CreateTagMappingDto,
  ): Promise<TagMapping> {
    return this.tagMappingService
      .createTagMapping(user, createTagMappingDto)
      .catch((error) => {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(`존재하지 않는 계획 혹은 태그입니다. `);
        }
        throw new InternalServerErrorException(
          '생성 중 오류가 발생하였습니다.',
        );
      });
  }

  @Delete(':id')
  async deleteTagMapping(@Param('id') id: number) {
    return this.tagMappingService
      .deleteTagMapping(id)
      .then(() => 'Delete Success');
  }
}
