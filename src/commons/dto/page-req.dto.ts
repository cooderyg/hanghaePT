import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TOPIC } from '../enum/enum';

export class PageReqDto {
  @Transform((param) => Number(param.value))
  @IsInt()
  page?: number = 1;

  @Transform((param) => Number(param.value))
  @IsInt()
  size?: number = 10;
}

export class TopicReqDto extends PageReqDto {
  @IsEnum(TOPIC)
  topic: TOPIC;
}

export class countReqDto {
  @Transform((param) => Number(param.value))
  @IsInt()
  count?: number = 15;
}

export class SearchReqDto extends PageReqDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
