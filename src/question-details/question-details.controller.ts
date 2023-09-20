import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuestionDetailsService } from './question-details.service';
import { CreateQuestionDetailDto } from './dto/create-question-detail.dto';

@Controller('question-details')
export class QuestionDetailsController {
  constructor(
    private readonly questionDetailsService: QuestionDetailsService,
  ) {}
}
