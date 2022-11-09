import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Share } from 'src/entities/share.entity';
import { ShareService } from './share.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateShareDto } from './share.dto';
import { User } from 'src/entities/user.entity';
import { EntityNotFoundError } from 'typeorm';

@Controller('shares')
export class ShareController {
  constructor(private shareService: ShareService) {}

  @Get()
  getShares(): Promise<Share[]> {
    return this.shareService.getShares();
  }

  @Get(':id')
  async getShare(@Param('id') id: number): Promise<void | Share> {
    return this.shareService.getShare(id).catch((error) => {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`존재하지 않는 공유입니다. id : ${id}`);
      }
      throw new InternalServerErrorException('조회 중 오류가 발생하였습니다.');
    });
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createShare(
    @Req() { user }: { user: User },
    @Body() createShareDto: CreateShareDto,
  ): Promise<Share> {
    return this.shareService
      .createShare(user, createShareDto)
      .catch((error) => {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(
            `존재하지 않는 플랜입니다. id : ${createShareDto.planId}`,
          );
        }
        throw new InternalServerErrorException(
          '생성 중 오류가 발생하였습니다.',
        );
      });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteShare(@Req() { user }: { user: User }, @Param('id') id: number) {
    return this.shareService
      .deleteShare(user, id)
      .then(() => 'Delete Success')
      .catch((error) => {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(`존재하지 않는 공유입니다. id : ${id}`);
        }
        throw new InternalServerErrorException(
          '삭제 중 오류가 발생하였습니다.',
        );
      });
  }
}
