import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  kakaoId: string;

  @IsString()
  @IsOptional()
  kakaoAccessToken: string;
}

export class UpdateUserDto extends CreateUserDto {}
