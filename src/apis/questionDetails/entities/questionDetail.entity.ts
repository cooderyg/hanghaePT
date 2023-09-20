import { Question } from 'src/apis/questions/entities/question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class QuestionDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  query: string;

  @Column({ type: 'text' })
  answer: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Question, (question) => question.questionDetails)
  question: Question;
}
