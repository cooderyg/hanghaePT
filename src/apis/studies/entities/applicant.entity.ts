import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Study } from './study.entity';
import { User } from 'src/apis/users/entities/user.entity';

@Entity()
export class Applicant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Study, (study) => study.applicants, { onDelete: 'CASCADE' })
  study: Study;

  @OneToMany(() => User, (user) => user.applicants, { onDelete: 'CASCADE' })
  user: User;
}
