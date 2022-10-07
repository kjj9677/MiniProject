import {
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePlanDto {
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  period: number;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  destination: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  title: string;

  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  createdBy: number; // FK
}
