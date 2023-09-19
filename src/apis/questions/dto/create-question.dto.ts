import { IsNotEmpty, IsString } from 'class-validator';
import { TYPE } from '../entities/question.entity';
import { TOPIC } from '../entities/question.entity';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsString()
  library: string;

  @IsNotEmpty()
  topic: TOPIC;

  @IsNotEmpty()
  type: TYPE;
}
