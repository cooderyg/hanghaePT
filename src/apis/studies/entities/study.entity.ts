import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudyUser } from './studyUser.entity';

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

@Entity()
export class Study {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  maxCount: number;

  @Column({ default: 1 })
  joinCount: number;

  @Column({ type: 'enum', enum: TOPIC })
  topic: TOPIC;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StudyUser, (studyUser) => studyUser.study, { cascade: true })
  studyUsers: StudyUser[];
}
