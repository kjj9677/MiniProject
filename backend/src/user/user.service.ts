import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  getUser(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async createUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
