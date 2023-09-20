import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDetailDto {
  @IsNotEmpty()
  @IsString()
  query: string;

  @IsNotEmpty()
  @IsString()
  answer: string;
}
