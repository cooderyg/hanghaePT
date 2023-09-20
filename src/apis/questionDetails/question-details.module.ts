import { Module } from '@nestjs/common';
import { QuestionDetailsService } from './question-details.service';
import { QuestionDetailsController } from './question-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionDetail } from './entities/questionDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionDetail])],
  controllers: [QuestionDetailsController],
  providers: [QuestionDetailsService],
  exports: [QuestionDetailsService],
})
export class QuestionDetailsModule {}
