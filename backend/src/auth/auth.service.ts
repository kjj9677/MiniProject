import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import qs from 'qs';

const RESTAPI_KEY = 'db80dea958060d111f015f8da9e4a89c';
const GET_TOKEN_URI = 'https://kauth.kakao.com/oauth/token';
const GET_USERINFO_URI = 'https://kapi.kakao.com/v2/user/me';
const GET_FRIENDS_URI =
  'https://kapi.kakao.com/v1/api/talk/friends?friend_order=nickname&limit=100&order=asc';
const GRANT_TYPE = 'authorization_code';
const REDIRECT_URI = 'http://localhost:3000/auth/login/kakao';
const CONTENT_TYPE = 'application/x-www-form-urlencoded;charset=utf-8';

@Injectable()
export class AuthService {
  async kakaoLogin(code: string): Promise<string> {
    const body = {
      grant_type: GRANT_TYPE,
      client_id: RESTAPI_KEY,
      redirect_uri: REDIRECT_URI,
      code,
    };
    const headers = {
      'Content-Type': CONTENT_TYPE,
    };

    return await axios({
      method: 'POST',
      url: GET_TOKEN_URI,
      timeout: 30000,
      headers,
      data: qs.stringify(body),
    })
      .then(async ({ data }) => {
        const headersWithAccessAToken = {
          'Content-Type': CONTENT_TYPE,
          Authorization: `Bearer ${data.access_token}`,
        };

        const response = await axios.get(GET_USERINFO_URI, {
          headers: headersWithAccessAToken,
        });

        if (response.status === 200) {
          console.log(response.data);
          return `id : ${response.data.id} login success`;
        } else {
          throw new UnauthorizedException(
            '카카오 유저 정보를 얻는데 실패하였습니다.',
          );
        }
      })
      .catch((e) => {
        console.log(e);
        throw new UnauthorizedException(
          '카카오 Access Token을 얻는데 실패하였습니다.',
        );
      });
  }
}
