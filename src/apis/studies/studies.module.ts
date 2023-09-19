import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Study } from './entities/study.entity';
import { StudyUser } from './entities/studyUser.entity';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Study, StudyUser])],
  controllers: [StudiesController],
  providers: [StudiesService],
})
export class StudiesModule {}
