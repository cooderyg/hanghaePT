import { ContinueQuestionDto } from './../../questions/dto/continue-question.dto';
export interface IQuestionDetailsServiceCreateQuestionDetails {
  questionId: string;
  chatgptAnswer: string;
  continueQuestionDto: ContinueQuestionDto;
}
