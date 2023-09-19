import { CreateQuestionDto } from '../dto/create-question.dto';

export interface IQuestionsServiceCreateQuestion {
  createQuestionDto: CreateQuestionDto;
  userId: string;
}

export interface IQuestionServiceFindById {
  userId: string;
}
