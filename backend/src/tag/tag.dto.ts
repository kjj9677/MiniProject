import { IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  title: string;
}

export class UpdateTagDto extends CreateTagDto {}
