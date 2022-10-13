import { Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login/kakao')
  async kakaoLogin(@Query() query: { code: string }): Promise<string> {
    return this.authService.kakaoLogin(query.code);
  }
}
