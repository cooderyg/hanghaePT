import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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
  APP = 'APP',
  WEB = 'WEB',
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  answer: string;

  @Column()
  library: string;

  @Column({ type: 'enum', enum: TOPIC })
  topic: TOPIC;

  @Column({ type: 'enum', enum: TYPE })
  type: TYPE;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.questions, { onDelete: 'CASCADE' })
  user: User;
}
