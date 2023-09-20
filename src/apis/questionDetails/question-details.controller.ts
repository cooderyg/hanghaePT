import { Controller } from '@nestjs/common';
import { QuestionDetailsService } from './question-details.service';

@Controller('question-details')
export class QuestionDetailsController {
  constructor(
    private readonly questionDetailsService: QuestionDetailsService,
  ) {}
}
