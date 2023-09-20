import { PageReqDto } from 'src/commons/dto/page-req.dto';
import { ContinueQuestionDto } from '../dto/continue-question.dto';

export interface IQuestionsServiceCreateQuestion {
  continueQuestionDto: ContinueQuestionDto;
  userId: string;
}

export interface IQuestionServiceFindAllQuestion {
  pageReqDto: PageReqDto;
}

export interface IQuestionServiceFindQuestion {
  userId: string;
  questionId: string;
}

export interface IQuestionServiceDeleteQuestion {
  userId: string;
  questionId: string;
}

export interface IQuestionServiceContinueQuestion {
  userId: string;
  questionId: string;
  continueQuestionDto: ContinueQuestionDto;
}
