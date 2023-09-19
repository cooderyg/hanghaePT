import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  // 질문 생성
  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return await this.questionsRepository.save(createQuestionDto);
  }

  // 모든 질문 조회

  async findAllQuestion(): Promise<Question[]> {
    return await this.questionsRepository.find();
  }
}
