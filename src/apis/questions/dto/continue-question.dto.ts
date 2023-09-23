import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TYPE } from '../entities/question.entity';
import { TOPIC } from '../entities/question.entity';

export class ContinueQuestionDto {
  // @IsString()
  // title: string;

  @IsOptional()
  @IsString()
  library: string;

  @IsNotEmpty()
  topic: TOPIC;

  @IsNotEmpty()
  type: TYPE;

  @IsNotEmpty()
  @IsString()
  query: string;
}
