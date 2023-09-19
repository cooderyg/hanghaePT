import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';

@Controller('/api/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // 질문 생성
  @Post()
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return await this.questionsService.createQuestion(createQuestionDto);
  }

  // 모든 질문 조회
  @Get()
  async findAllQuestion(): Promise<Question[]> {
    return this.questionsService.findAllQuestion();
  }
}
