import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';
import { User, UserAfterAuth } from 'src/commons/decorators/user.decorator';
import { AccessAuthGuard } from '../auth/guard/auth.guard';

@Controller('/api/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // 질문 생성
  @UseGuards(AccessAuthGuard)
  @Post()
  async createQuestion(
    @User() user: UserAfterAuth,
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return await this.questionsService.createQuestion({
      userId: user.id,
      createQuestionDto,
    });
  }

  // 모든 질문 조회
  @Get()
  async findAllQuestion(): Promise<Question[]> {
    return await this.questionsService.findAllQuestion();
  }

  // 질문 조회
  @UseGuards(AccessAuthGuard)
  @Get(':questionId')
  async findQuestion(
    @User() user: UserAfterAuth,
    @Param('questionId') questionId: string,
  ): Promise<Question> {
    return await this.questionsService.findQuestion({
      userId: user.id,
      questionId,
    });
  }

  // 질문 삭제 (유저가드 추가 필요)
  @UseGuards(AccessAuthGuard)
  @Delete(':questionId')
  async deleteQuestion(
    @User() user: UserAfterAuth,
    @Param('questionId') questionId: string,
  ): Promise<void> {
    return await this.questionsService.deleteQuestion({
      userId: user.id,
      questionId,
    });
  }
}
