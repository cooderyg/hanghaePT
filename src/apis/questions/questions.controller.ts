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
import { KakaoAuthGuard } from '../auth/guard/auth.guard';
import { SocialUser } from 'src/commons/decorators/user.decorator';
import { SocialUserAfterAuth } from 'src/commons/decorators/user.decorator';

@Controller('/api/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // 질문 생성
  @UseGuards(KakaoAuthGuard)
  @Post()
  async createQuestion(
    @SocialUser() user: SocialUserAfterAuth,
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

  // 질문 조회 (유저가드 추가 필요)
  @Get(':questionId')
  async findQuestion(
    @Param('questionId') questionId: string,
  ): Promise<Question> {
    return await this.questionsService.findQuestion(questionId);
  }

  // 질문 삭제 (유저가드 추가 필요)
  @Delete(':questionId')
  async deleteQuestion(@Param('questionId') questionId: string): Promise<void> {
    return await this.questionsService.deleteQuestion(questionId);
  }
}
