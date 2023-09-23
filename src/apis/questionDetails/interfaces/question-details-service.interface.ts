import { SearchReqDto } from 'src/commons/dto/page-req.dto';
import { ContinueQuestionDto } from './../../questions/dto/continue-question.dto';
export interface IQuestionDetailsServiceCreateQuestionDetails {
  questionId: string;
  chatgptAnswer: string;
  continueQuestionDto: ContinueQuestionDto;
}

export interface IQuestionDetailsServiceFindMyQuestionDetails {
  searchReqDto: SearchReqDto;
  userId: string;
}
