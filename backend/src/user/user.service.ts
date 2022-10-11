import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class UserService {
  getUsers(): Promise<User[]> {
    return getRepository(User).find();
  }

  getUser(id: number): Promise<User> {
    return getRepository(User).findOne(id);
  }

  async createUser(user: User): Promise<void> {
    await getRepository(User).insert(user);
  }
}
