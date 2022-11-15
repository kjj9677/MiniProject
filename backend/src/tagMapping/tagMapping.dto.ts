import { IsInt, Max, Min } from 'class-validator';

export class CreateTagMappingDto {
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  planId: number;

  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  tagId: number;
}
