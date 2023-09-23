import { Question } from 'src/apis/questions/entities/question.entity';
import { TOPIC, TYPE } from 'src/commons/enum/enum';
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

  @Column({ nullable: true })
  library: string;

  @Column({ type: 'enum', enum: TOPIC })
  topic: TOPIC;

  @Column({ type: 'enum', enum: TYPE })
  type: TYPE;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Question, (question) => question.questionDetails, {
    onDelete: 'CASCADE',
  })
  question: Question;
}
