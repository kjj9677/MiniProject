import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';
import axios from 'axios';
import qs from 'qs';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';

const RESTAPI_KEY = 'db80dea958060d111f015f8da9e4a89c';
const GET_TOKEN_URI = 'https://kauth.kakao.com/oauth/token';
const GET_USERINFO_URI = 'https://kapi.kakao.com/v2/user/me';
const GET_FRIENDS_URI =
  'https://kapi.kakao.com/v1/api/talk/friends?friend_order=nickname&limit=100&order=asc';
const GRANT_TYPE = 'authorization_code';
const REDIRECT_URI =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3030/login/kakao'
    : 'http://211.197.23.229:3030/login/kakao';
const CONTENT_TYPE = 'application/x-www-form-urlencoded;charset=utf-8';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async kakaoLogin(code: string): Promise<{ accessToken: string }> {
    const body = {
      grant_type: GRANT_TYPE,
      client_id: RESTAPI_KEY,
      redirect_uri: REDIRECT_URI,
      code,
    };

    const headers = {
      'Content-Type': CONTENT_TYPE,
    };

    const { data } = await axios({
      method: 'POST',
      url: GET_TOKEN_URI,
      timeout: 30000,
      headers,
      data: qs.stringify(body),
    }).catch((e) => {
      console.log(e);
      throw new UnauthorizedException(
        '카카오 Access Token을 얻는데 실패하였습니다.',
      );
    });

    const kakaoAccessToken = data.access_token;

    const headersWithAccessAToken = {
      'Content-Type': CONTENT_TYPE,
      Authorization: `Bearer ${kakaoAccessToken}`,
    };

    const {
      data: { id },
    } = await axios
      .get(GET_USERINFO_URI, {
        headers: headersWithAccessAToken,
      })
      .catch((e) => {
        console.log(e);
        throw new UnauthorizedException(
          '카카오 유저 정보를 얻는데 실패하였습니다.',
        );
      });

    const kakaoId = id.toString();

    const doesUserExist = await this.checkDoesUserExistsByKakaoId(kakaoId);
    if (doesUserExist) {
      await getRepository(User).update({ kakaoId }, { kakaoAccessToken });
    } else {
      const newUser = getRepository(User).create({ kakaoAccessToken, kakaoId });
      await getRepository(User).insert(newUser);
    }
    const accessToken = await this.jwtService.sign({ kakaoId });
    return { accessToken };
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
}
