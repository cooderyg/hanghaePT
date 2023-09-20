import { Body, Injectable, Param, Post, UseGuards } from '@nestjs/common';
import { CreateQuestionDetailDto } from './dto/create-question-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDetail } from './entities/questionDetail.entity';
import { Repository } from 'typeorm';
import { AccessAuthGuard } from '../auth/guard/auth.guard';
import { User, UserAfterAuth } from 'src/commons/decorators/user.decorator';

@Injectable()
export class QuestionDetailsService {
  constructor(
    @InjectRepository(QuestionDetail)
    private readonly questionDetailsRepository: Repository<QuestionDetail>,
  ) {}

  // 이전질문을 조회해서 가져오기
  async findQuestionDetail(questionId: string) {
    const questions = await this.questionDetailsRepository.find({
      where: { question: { id: questionId } },
    });

    return questions;
  }

  async createQuestionDetail(questionId, query, chatgptAnswer) {
    const createQuestion = await this.questionDetailsRepository.save({
      questionId,
      query,
      chatgptAnswer,
    });
    return;
  }
}