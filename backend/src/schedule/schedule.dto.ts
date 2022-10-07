import { OmitType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateScheduleDto {
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  startTime: number;

  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  duration: number;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  title: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(300)
  description: string;

  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  planId: number;

  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  scheduleTypeId: number;

  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  createdBy: number; // FK
}

export class UpdateScheduleDto extends OmitType(CreateScheduleDto, [
  'createdBy',
  'planId',
] as const) {}
