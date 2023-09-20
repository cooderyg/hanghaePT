import { Module } from '@nestjs/common';
import { QuestionDetailsService } from './question-details.service';
import { QuestionDetailsController } from './question-details.controller';

@Module({
  controllers: [QuestionDetailsController],
  providers: [QuestionDetailsService]
})
export class QuestionDetailsModule {}
