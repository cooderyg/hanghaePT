import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TOPIC, TYPE } from 'src/commons/enum/enum';

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
