import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatgptsService } from '../chatgpts/chatgpts.service';
import {
  IQuestionServiceContinueQuestion,
  IQuestionServiceDeleteQuestion,
  IQuestionServiceFilterQuestion,
  IQuestionServiceFindAllQuestion,
  IQuestionServiceFindQuestion,
  IQuestionServiceSearchQuestion,
  IQuestionsServiceCreateQuestion,
} from './interfaces/questions-service.interface';
import { QuestionDetailsService } from '../questionDetails/question-details.service';
import { MessageResDto } from 'src/commons/dto/message-res.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    private readonly chatgptsService: ChatgptsService,
    private readonly questionDetailsService: QuestionDetailsService,
  ) {}

  // // 질문 검색
  // async searchQuestion({
  //   keyword,
  // }: IQuestionServiceSearchQuestion): Promise<Question[]> {
  //   const questions = await this.questionsRepository
  //     .createQueryBuilder('question')
  //     .select([
  //       'question.title',
  //       'question.library',
  //       'question.topic',
  //       'question.type',
  //     ])
  //     .where(
  //       'question.title LIKE :keyword OR question.library LIKE :keyword OR question.topic LIKE :keyword OR question.type LIKE :keyword',
  //       {
  //         keyword: `%${keyword}%`,
  //       },
  //     )
  //     .getMany();

  //   if (questions.length === 0) {
  //     throw new HttpException(
  //       '검색 결과가 존재하지 않습니다.',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   return questions;
  // }

  // // 모든 질문 조회 (페이지네이션)
  // async findAllQuestion({
  //   pageReqDto,
  // }: IQuestionServiceFindAllQuestion): Promise<Question[]> {
  //   const { page, size } = pageReqDto;

  //   const questions = await this.questionsRepository.findAndCount({
  //     order: { createdAt: 'DESC' },
  //     take: size,
  //     skip: (page - 1) * size,
  //   });

  //   return questions;
  // }

  // 모든 질문 조회 (페이지네이션)
  async findAllQuestion({
    searchReqDto,
  }: IQuestionServiceFindAllQuestion): Promise<[Question[], number]> {
    const { page, size, keyword } = searchReqDto;
    let query = this.questionsRepository
      .createQueryBuilder('question')
      .select([
        'question.title',
        'question.library',
        'question.topic',
        'question.type',
      ])
      .orderBy('question.createdAt', 'DESC')
      .take(size)
      .skip((page - 1) * size);

    if (keyword) {
      query = query.where(
        'question.title LIKE :keyword OR question.library LIKE :keyword OR question.topic LIKE :keyword OR question.type LIKE :keyword',
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    const [questions, total] = await query.getManyAndCount();
    return [questions, total];
  }

  // 질문하기
  async continueQuestion({
    questionId,
    userId,
    continueQuestionDto,
  }: IQuestionServiceContinueQuestion): Promise<string> {
    const { query, type, topic, library } = continueQuestionDto;

    const question = await this.findQuestion({ questionId, userId });
    if (!question.title) {
      question.title = query;
    }

    question.type = type;
    question.topic = topic;
    if (library) {
      question.library = library;
    }
    await this.questionsRepository.save(question);

    const questionDetails =
      await this.questionDetailsService.findQuestionDetail(questionId);
    if (questionDetails.length > 20) {
      throw new ForbiddenException('최대 질문 개수가 초과되었습니다.');
    }

    const chatgptAnswer = await this.chatgptsService.createChatgpt(
      questionDetails,
      continueQuestionDto,
    );

    await this.questionDetailsService.createQuestionDetail({
      questionId,
      query,
      chatgptAnswer,
    });

    return chatgptAnswer;
  }

  // 질문 방 생성
  async createQuestion({ userId }): Promise<Question> {
    return await this.questionsRepository.save({
      user: { id: userId },
    });
  }

  // 최근 질문 15개 조회
  async findRecentQuestion({ userId, countReqDto }): Promise<Question[]> {
    const { count } = countReqDto;

    const questions = await this.questionsRepository.find({
      order: { createdAt: 'DESC' },
      take: count,
      where: { user: { id: userId } },
    });

    return questions;
  }

  // 질문 1개 조회
  async findQuestion({
    userId,
    questionId,
  }: IQuestionServiceFindQuestion): Promise<Question> {
    const question = await this.questionsRepository.findOne({
      where: { id: questionId },
      relations: ['user', 'questionDetails'],
    });

    if (!question) {
      throw new HttpException(
        '질문을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (question.user.id !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return question;
  }

  // 질문 삭제하기
  async deleteQuestion({
    userId,
    questionId,
  }: IQuestionServiceDeleteQuestion): Promise<MessageResDto> {
    const question = await this.questionsRepository.findOne({
      where: { id: questionId },
      relations: ['user'],
    });

    if (!question) {
      throw new HttpException(
        '질문을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (question.user.id !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.questionsRepository.remove(question);
    return { message: '질문이 삭제되었습니다.' };
  }
}
