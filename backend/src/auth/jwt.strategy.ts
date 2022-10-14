import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: 'MiniProject',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const { kakaoId } = payload;
    const user: User = await getRepository(User).findOne(
      { kakaoId },
      { relations: ['shares'] },
    );

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저입니다.');
    }

    return user;
  }
}
