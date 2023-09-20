import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { TOPIC } from 'src/apis/questions/entities/question.entity';

export class PageReqDto {
  @Transform((param) => Number(param.value))
  @IsInt()
  page?: number = 1;

  @Transform((param) => Number(param.value))
  @IsInt()
  size?: number = 20;
}

export class TopicReqDto extends PageReqDto {
  @IsNotEmpty()
  @IsEnum(TOPIC)
  topic: TOPIC;
}

export class countReqDto {
  @Transform((param) => Number(param.value))
  @IsInt()
  count?: number = 10;
}

export class searchReqDto extends PageReqDto {
  @IsString()
  keyword: string;
}
