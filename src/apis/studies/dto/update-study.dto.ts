import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TOPIC } from 'src/apis/questions/entities/question.entity';

export class UpdateStudyDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  content?: string;

  @IsNotEmpty()
  @IsNumber()
  maxCount?: number;

  @IsNotEmpty()
  @IsEnum(TOPIC)
  topic?: TOPIC;
}
