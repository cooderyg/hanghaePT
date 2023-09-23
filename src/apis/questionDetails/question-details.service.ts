import { Body, Injectable, Param, Post, UseGuards } from '@nestjs/common';
import { CreateQuestionDetailDto } from './dto/create-question-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDetail } from './entities/questionDetail.entity';
import { Repository } from 'typeorm';
import { AccessAuthGuard } from '../auth/guard/auth.guard';
import { User, UserAfterAuth } from 'src/commons/decorators/user.decorator';
import { IQuestionDetailsServiceCreateQuestionDetails } from './interfaces/question-details-service.interface';

@Injectable()
export class QuestionDetailsService {
  constructor(
    @InjectRepository(QuestionDetail)
    private readonly questionDetailsRepository: Repository<QuestionDetail>,
  ) {}

  // 이전질문을 조회해서 가져오기
  async findQuestionDetail(questionId: string): Promise<QuestionDetail[]> {
    const questions = await this.questionDetailsRepository
      .createQueryBuilder('questionDetail')
      .select([
        'questionDetail.id',
        'questionDetail.query',
        'questionDetail.answer',
        'questionDetail.createdAt',
        'question.id',
      ])
      .where('questionDetail.question.id = :questionId', { questionId })
      .leftJoin('questionDetail.question', 'question')
      .orderBy('questionDetail.createdAt', 'ASC')
      .getMany();

    return questions;
  }

  // 질문 저장히기
  async createQuestionDetail({
    questionId,
    chatgptAnswer,
    continueQuestionDto,
  }: IQuestionDetailsServiceCreateQuestionDetails): Promise<void> {
    const answer = JSON.parse(chatgptAnswer).message;
    const createQuestion = await this.questionDetailsRepository.save({
      question: { id: questionId },
      answer,
      ...continueQuestionDto,
    });
    return;
  }
}
