import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Share } from 'src/entities/share.entity';
import { ShareService } from './share.service';

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
  createShare(@Body() share: Share) {
    return this.shareService.createShare(share);
  }

  @Delete(':id')
  deleteShare(@Param('id') id: number) {
    return this.shareService.deleteShare(id);
  }
}
