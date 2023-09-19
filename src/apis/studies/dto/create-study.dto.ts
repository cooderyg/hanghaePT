import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TOPIC } from '../entities/study.entity';

export class CreateStudyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  maxCount: number;

  @IsNotEmpty()
  @IsEnum(TOPIC)
  topic: TOPIC;
}
