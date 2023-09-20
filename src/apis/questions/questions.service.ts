import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatgptsService } from '../chatgpts/chatgpts.service';
import {
  IQuestionServiceDeleteQuestion,
  IQuestionServiceFindAllQuestion,
  IQuestionServiceFindQuestion,
  IQuestionsServiceCreateQuestion,
} from './interfaces/questions-service.interface';
import { QuestionDetailsService } from '../questionDetails/question-details.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    private readonly chatgptsService: ChatgptsService,
    private readonly questionDetailsService: QuestionDetailsService,
  ) {}

  async updateQuestion() {}

  // 질문 생성
  async createQuestion({
    userId,
    createQuestionDto,
  }: IQuestionsServiceCreateQuestion): Promise<Question> {
    // 질문가져오기
    const question = createQuestionDto.title;

    // 질문을 챗 gpt에게 넘겨서 답변 받기
    const chatgptAnswer = await this.chatgptsService.createChatgpt(question);

    // 답변을 JSON으로 변환
    const responseData = JSON.parse(chatgptAnswer);

    // responseData 메세지를 createQuestionDto.answer에 삽입
    // createQuestionDto.answer = responseData.message;

    return await this.questionsRepository.save({
      user: { id: userId },
      ...createQuestionDto,
    });
  }

  // 모든 질문 조회 (페이지네이션)
  async findAllQuestion({
    pageReqDto,
  }: IQuestionServiceFindAllQuestion): Promise<Question[]> {
    const { page, size } = pageReqDto;

    const questions = await this.questionsRepository.find({
      order: { createdAt: 'ASC' }, // 최근순이 아래로 나오게
      take: size,
      skip: (page - 1) * size,
    });

    return questions;
  }

  // 최근 질문 10개 조회
  async findRecentQuestion({ userId, countReqDto }): Promise<Question[]> {
    const { count } = countReqDto;

    const questions = await this.questionsRepository.find({
      order: { createdAt: 'DESC' },
      take: count,
    });

    return questions;
  }

  // 질문 조회
  async findQuestion({
    userId,
    questionId,
  }: IQuestionServiceFindQuestion): Promise<Question> {
    const question = await this.questionsRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new HttpException(
        '질문을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return question;
  }

  // 질문 삭제하기
  async deleteQuestion({
    userId,
    questionId,
  }: IQuestionServiceDeleteQuestion): Promise<void> {
    const question = await this.questionsRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new HttpException(
        '질문을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.questionsRepository.remove(question);
  }
}
