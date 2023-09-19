import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Study } from './study.entity';
import { User } from 'src/apis/users/entities/user.entity';

@Entity()
export class StudyUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isHost: boolean;

  @ManyToOne(() => Study, (study) => study.studyUsers)
  study: Study;

  @ManyToOne(() => User, (user) => user.studyUsers)
  user: User;
}
