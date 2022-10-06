import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Share } from 'src/entities/share.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Share])],
  exports: [TypeOrmModule],
  providers: [ShareService],
  controllers: [ShareController],
})
export class ShareModule {}
