import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatgptsService } from '../chatgpts/chatgpts.service';
import {
  IQuestionServiceDeleteQuestion,
  IQuestionServiceFindQuestion,
  IQuestionsServiceCreateQuestion,
} from './interfaces/questions-service.interface';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    private readonly chatgptsService: ChatgptsService,
  ) {}

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
    createQuestionDto.answer = responseData.message;

    return await this.questionsRepository.save({
      id: userId,
      title: createQuestionDto.title,
      answer: createQuestionDto.answer,
      library: createQuestionDto.library,
      topic: createQuestionDto.topic,
      type: createQuestionDto.type,
    });
  }

  // 모든 질문 조회
  async findAllQuestion(): Promise<Question[]> {
    return await this.questionsRepository.find();
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

  // 질문 삭제하기 (유저가드 필요)
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
