import { QuestionDetail } from 'src/apis/questionDetails/entities/questionDetail.entity';
import { User } from 'src/apis/users/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TOPIC {
  JAVA = 'JAVA',
  JAVASCRIPT = 'JAVASCRIPT',
  KOTLIN = 'KOTLIN',
  REACT = 'REACT',
  NEXT = 'NEXT',
  NEST = 'NEST',
  NODE = 'NODE',
  SPRING = 'SPRING',
  CS = 'CS',
}

export enum TYPE {
  APP = 'APP', // 모바일 앱 개발
  WEB = 'WEB', // 웹 개발
  TOOL = 'TOOL', // 개발 도구
  LANGUAGE = 'LANGUAGE', // 개발 언어
  SECURITY = 'SECURITY', // 보안
  DATA = 'DATA', // 데이터 관리
  CAREER = 'CAREER', // 채용
}

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
