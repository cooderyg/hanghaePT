import { QuestionDetail } from 'src/apis/questionDetails/entities/questionDetail.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { TOPIC, TYPE } from 'src/commons/enum/enum';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  library: string;

  @Column({ type: 'enum', enum: TOPIC, nullable: true })
  topic: TOPIC;

  @Column({ type: 'enum', enum: TYPE, nullable: true })
  type: TYPE;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.questions, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(
    () => QuestionDetail,
    (questionDetail) => questionDetail.question,
    { cascade: true },
  )
  questionDetails: QuestionDetail[];
}
