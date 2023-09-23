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
  NEXT = 'NEXTJS',
  NEST = 'NESTJS',
  NODE = 'NODEJS',
  SPRING = 'SPRING',
  CS = 'COMPUTER SCIENCE',
}

export enum TYPE {
  APP = 'APP DEVELOPMENT', // 모바일 앱 개발
  WEB = 'WEB DEVELOPMENT', // 웹 개발
  TOOL = 'DEVELOPMENT TOOL', // 개발 도구
  LANGUAGE = 'PROGRAMMING LANGUAGE', // 개발 언어
  SECURITY = 'COMPUTER SECURITY', // 보안
  DATA = 'DATA MANAGEMENT', // 데이터 관리
  CAREER = 'DEVELOPER CAREER', // 채용
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
