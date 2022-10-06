import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Share } from 'src/entities/share.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(Share)
    private shareRepository: Repository<Share>,
  ) {}

  getShares(): Promise<Share[]> {
    return this.shareRepository.find();
  }

  getShare(id: number): Promise<Share> {
    return this.shareRepository.findOne(id);
  }

  async createShare(share: Share): Promise<void> {
    await this.shareRepository.save(share);
  }

  async deleteShare(id: number): Promise<void> {
    await this.shareRepository.delete(id);
  }
}
