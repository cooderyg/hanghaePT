import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  IUserServiceFindByEmail,
  IUserServiceFindById,
  IUsersServiceCreateUser,
} from './interfaces/users-serviice.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail({ email }: IUserServiceFindByEmail): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findById({ id }: IUserServiceFindById): Promise<User> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async createUser({ createUserDto }: IUsersServiceCreateUser): Promise<User> {
    const { email, password, name, profileImgUrl } = createUserDto;
    const user = await this.findByEmail({ email });

    if (user) throw new ConflictException('이미 등록 된 이메일입니다.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.usersRepository.save({
      email,
      name,
      password: hashedPassword,
      profileImgUrl,
    });

    return result;
  }
}
