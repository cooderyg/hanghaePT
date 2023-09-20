import { PageReqDto } from 'src/commons/dto/page-req.dto';
import { ContinueQuestionDto } from '../dto/continue-question.dto';
import { TOPIC, TYPE } from '../entities/question.entity';

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

export interface IQuestionServiceSearchQuestion {
  keyword: string;
}

export interface IQuestionServiceFilterQuestion {
  topic: TOPIC;
  type: TYPE;
}
