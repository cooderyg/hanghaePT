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
import { SearchReqDto, countReqDto } from 'src/commons/dto/page-req.dto';
import { ContinueQuestionDto } from './dto/continue-question.dto';
import { MessageResDto } from 'src/commons/dto/message-res.dto';

@Controller('/api/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // 질문 전체조회 & 검색
  @Get()
  async findAllQuestion(
    @Query() searchReqDto: SearchReqDto,
  ): Promise<[Question[], number]> {
    const questions = await this.questionsService.findAllQuestion({
      searchReqDto,
    });

    return questions;
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

  // 최근 질문 15개 조회
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
  ) {
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
