import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudyUser } from './studyUser.entity';
import { TOPIC } from 'src/commons/enum/enum';
import { Applicant } from './applicant.entity';

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

  @OneToMany(() => Applicant, (applicant) => applicant.study, { cascade: true })
  applicants: Applicant[];
}
