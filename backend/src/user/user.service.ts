import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  getUsers(): Promise<User[]> {
    return getRepository(User).find();
  }

  getUser(id: number): Promise<User> {
    return getRepository(User).findOne(id);
  }

  async createUser(user: CreateUserDto): Promise<void> {
    const doesUserExist = await this.checkDoesUserExistsByKakaoId(user.kakaoId);
    if (doesUserExist) {
      throw new ConflictException('이미 존재하는 유저입니다.');
    }

    await getRepository(User).insert(user);
  }

  private async checkDoesUserExistsByKakaoId(
    kakaoId: string,
  ): Promise<boolean> {
    const user = await getRepository(User)
      .find({
        where: { kakaoId: kakaoId },
      })
      .catch(() => {
        throw new InternalServerErrorException(
          '카카오 아이디로 유저 조회 중 오류가 발생하였습니다.',
        );
      });

    return !isEmpty(user);
  }

  async deleteUser(id: number): Promise<void> {
    const foundUser = await getRepository(User).findOne(id);
    if (!foundUser) {
      throw new NotFoundException();
    }
    await getRepository(User).delete(id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const foundUser = await getRepository(User).findOne(id);
    if (!foundUser) {
      throw new NotFoundException();
    }
    await getRepository(User).update({ id }, updateUserDto);
  }
}
