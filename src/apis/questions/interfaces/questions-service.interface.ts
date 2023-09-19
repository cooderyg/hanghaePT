import { CreateQuestionDto } from '../dto/create-question.dto';

export interface IQuestionsServiceCreateQuestion {
  createQuestionDto: CreateQuestionDto;
  userId: string;
}

export interface IQuestionServiceFindQuestion {
  userId: string;
  questionId: string;
}

export interface IQuestionServiceDeleteQuestion {
  userId: string;
  questionId: string;
}
