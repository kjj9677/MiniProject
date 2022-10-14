import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateShareDto {
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  planId: number;

  @IsString()
  memberKakaoId: string;
}
