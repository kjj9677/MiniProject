import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('shares')
export class ShareController {
  constructor(private shareService: ShareService) {}

  @Get()
  getShares(): Promise<Share[]> {
    return this.shareService.getShares();
  }

  @Get(':id')
  getShare(@Param('id') id: number): Promise<Share> {
    return this.shareService.getShare(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createShare(
    @Req() { user }: { user: User },
    @Body() createShareDto: CreateShareDto,
  ) {
    return this.shareService.createShare(user, createShareDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteShare(@Req() { user }: { user: User }, @Param('id') id: number) {
    return this.shareService.deleteShare(user, id);
  }
}
