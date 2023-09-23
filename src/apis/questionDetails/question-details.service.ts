import { Body, Injectable, Param, Post, UseGuards } from '@nestjs/common';
import { CreateQuestionDetailDto } from './dto/create-question-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDetail } from './entities/questionDetail.entity';
import { Brackets, Repository } from 'typeorm';
import { AccessAuthGuard } from '../auth/guard/auth.guard';
import { User, UserAfterAuth } from 'src/commons/decorators/user.decorator';
import {
  IQuestionDetailsServiceCreateQuestionDetails,
  IQuestionDetailsServiceFindMyQuestionDetails,
} from './interfaces/question-details-service.interface';

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

  // 내 질문 상세들 가져오기
  async findMyQuestionDetails({
    searchReqDto,
    userId,
  }: IQuestionDetailsServiceFindMyQuestionDetails): Promise<
    [QuestionDetail[], number]
  > {
    const { page, size, keyword } = searchReqDto;
    let questionDetails: [QuestionDetail[], number];
    if (keyword) {
      // questions = await this.questionDetailsRepository.findAndCount({
      //   where: [
      //     { query: Like(`%${keyword}%`), user: { id: userId } },
      //     { library: Like(`%${keyword}%`), user: { id: userId } },
      //   ],
      //   order: { createdAt: 'DESC' },
      //   take: size,
      //   skip: (page - 1) * size,
      // });
      questionDetails = await this.questionDetailsRepository
        .createQueryBuilder('questionDetail')
        .select([
          'questionDetail.id',
          'questionDetail.query',
          'questionDetail.answer',
          'questionDetail.library',
          'questionDetail.topic',
          'questionDetail.type',
          'questionDetail.createdAt',
          'question.id',
          'user.id',
        ])
        .leftJoin('questionDetail.question', 'question')
        .leftJoin('question.user', 'user')
        .where('user.id = :userId', { userId })
        .andWhere(
          new Brackets((qb) => {
            qb.where('questionDetail.query like :keyword', {
              keyword: `%${keyword}%`,
            })
              .orWhere('questionDetail.answer like :keyword', {
                keyword: `%${keyword}%`,
              })
              .orWhere('questionDetail.library like :keyword', {
                keyword: `%${keyword}%`,
              });
          }),
        )
        .orderBy('questionDetail.createdAt', 'DESC')
        .take(size)
        .skip((page - 1) * size)
        .getManyAndCount();
    } else {
      questionDetails = await this.questionDetailsRepository
        .createQueryBuilder('questionDetail')
        .select([
          'questionDetail.id',
          'questionDetail.query',
          'questionDetail.answer',
          'questionDetail.library',
          'questionDetail.topic',
          'questionDetail.type',
          'questionDetail.createdAt',
          'question.id',
          'user.id',
        ])
        .leftJoin('questionDetail.question', 'question')
        .leftJoin('question.user', 'user')
        .where('user.id = :userId', { userId })
        .orderBy('questionDetail.createdAt', 'DESC')
        .take(size)
        .skip((page - 1) * size)
        .getManyAndCount();
    }
    return questionDetails;
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
