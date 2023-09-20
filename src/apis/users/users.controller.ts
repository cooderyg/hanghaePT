import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResDto, FindUserResDto } from './dto/res.dto';
import { AccessAuthGuard } from '../auth/guard/auth.guard';
import { User, UserAfterAuth } from 'src/commons/decorators/user.decorator';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResDto> {
    await this.usersService.createUser({ createUserDto });
    return { message: '가입 완료' };
  }

  @UseGuards(AccessAuthGuard)
  @Get()
  async findUser(@User() user: UserAfterAuth): Promise<FindUserResDto> {
    const userInfo = await this.usersService.findById({ id: user.id });
    return userInfo;
  }
}
