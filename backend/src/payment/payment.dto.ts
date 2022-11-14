import { IsInt, Max, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  scheduleId: number;

  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  memberId: number;
}
