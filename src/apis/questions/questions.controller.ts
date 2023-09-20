import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';
import { User, UserAfterAuth } from 'src/commons/decorators/user.decorator';
import { AccessAuthGuard } from '../auth/guard/auth.guard';
import { PageReqDto, countReqDto } from 'src/commons/dto/page-req.dto';

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

  // 모든 질문 조회 (페이지 네이션)
  @Get()
  async findAllQuestion(@Query() pageReqDto: PageReqDto): Promise<Question[]> {
    const questions = await this.questionsService.findAllQuestion({
      pageReqDto,
    });

    return questions;
  }

  // 최근 질문 10개 조회
  @UseGuards(AccessAuthGuard)
  @Get('recent')
  async findRecentQuestion(
    @User() user: UserAfterAuth,
    @Query() countReqDto: countReqDto,
  ): Promise<Question[]> {
    const questions = await this.questionsService.findRecentQuestion({
      userId: user.id,
      countReqDto,
    });

    return questions;
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
