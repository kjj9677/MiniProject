import { IsInt, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  kakaoId: number;
}

export class UpdateUserDto extends CreateUserDto {}
