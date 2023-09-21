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
import { Question, TOPIC, TYPE } from './entities/question.entity';
import { User, UserAfterAuth } from 'src/commons/decorators/user.decorator';
import { AccessAuthGuard } from '../auth/guard/auth.guard';
import { PageReqDto, countReqDto } from 'src/commons/dto/page-req.dto';
import { ContinueQuestionDto } from './dto/continue-question.dto';
import { MessageResDto } from 'src/commons/dto/message-res.dto';

@Controller('/api/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // 질문 검색
  @Post('search')
  async searchQuestion(@Body('keyword') keyword: string): Promise<Question[]> {
    return await this.questionsService.searchQuestion({ keyword });
  }

  // 질문 필터
  @Post('filter')
  async filterQuestion(
    @Body('topic') topic: TOPIC,
    @Body('type') type: TYPE,
  ): Promise<Question[]> {
    return this.questionsService.filterQuestion({ topic, type });
  }

  // 질문하기
  @UseGuards(AccessAuthGuard)
  @Post(':questionId')
  async ContinueQuestionDto(
    @User() user: UserAfterAuth,
    @Param('questionId') questionId: string,
    @Body() continueQuestionDto: ContinueQuestionDto,
  ): Promise<string> {
    const answer = await this.questionsService.continueQuestion({
      userId: user.id,
      questionId,
      continueQuestionDto,
    });

    return answer;
  }

  // 질문 방 생성
  @UseGuards(AccessAuthGuard)
  @Post()
  async createQuestion(@User() user: UserAfterAuth): Promise<Question> {
    return await this.questionsService.createQuestion({
      userId: user.id,
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

  // 질문 1개 조회
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

  // 질문 삭제
  @UseGuards(AccessAuthGuard)
  @Delete(':questionId')
  async deleteQuestion(
    @User() user: UserAfterAuth,
    @Param('questionId') questionId: string,
  ): Promise<MessageResDto> {
    return await this.questionsService.deleteQuestion({
      userId: user.id,
      questionId,
    });
  }
}
