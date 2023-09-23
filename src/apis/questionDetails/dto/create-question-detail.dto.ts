import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TOPIC, TYPE } from 'src/commons/enum/enum';

export class CreateQuestionDetailDto {
  @IsNotEmpty()
  @IsString()
  query: string;

  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsOptional()
  @IsString()
  library: string;

  @IsNotEmpty()
  @IsString()
  topic: TOPIC;

  @IsNotEmpty()
  @IsString()
  type: TYPE;
}
