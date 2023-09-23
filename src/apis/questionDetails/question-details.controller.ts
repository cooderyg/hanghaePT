import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QuestionDetailsService } from './question-details.service';
import { AccessAuthGuard } from '../auth/guard/auth.guard';
import { SearchReqDto } from 'src/commons/dto/page-req.dto';
import { User, UserAfterAuth } from 'src/commons/decorators/user.decorator';
import { QuestionDetail } from './entities/questionDetail.entity';

@Controller('api/question-details')
export class QuestionDetailsController {
  constructor(
    private readonly questionDetailsService: QuestionDetailsService,
  ) {}

  @UseGuards(AccessAuthGuard)
  @Get()
  async findMyQuestionDetails(
    @Query() searchReqDto: SearchReqDto,
    @User() user: UserAfterAuth,
  ): Promise<[QuestionDetail[], number]> {
    const qestionDetails =
      await this.questionDetailsService.findMyQuestionDetails({
        searchReqDto,
        userId: user.id,
      });
    return qestionDetails;
  }
}
