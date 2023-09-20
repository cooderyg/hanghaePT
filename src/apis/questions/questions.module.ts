import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { ChatgptsService } from '../chatgpts/chatgpts.service';
import { QuestionDetailsModule } from '../questionDetails/question-details.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), QuestionDetailsModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, ChatgptsService],
})
export class QuestionsModule {}
