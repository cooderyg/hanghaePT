import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudiesService } from './studies.service';
import { CreateStudyDto } from './dto/create-study.dto';
import { MessageResDto } from 'src/commons/dto/message-res.dto';
import { AccessAuthGuard } from '../auth/guard/auth.guard';
import { User, UserAfterAuth } from 'src/commons/decorators/user.decorator';
import { ForcedExitStudyDto } from './dto/forcedExit-study.dto';
import { Study } from './entities/study.entity';
import { PageReqDto, TopicReqDto } from 'src/commons/dto/page-req.dto';

@Controller('api/studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @UseGuards(AccessAuthGuard)
  @Post()
  async createStudy(
    @Body() createStudyDto: CreateStudyDto,
    @User() user: UserAfterAuth,
  ) {
    const study = await this.studiesService.createStudy({
      createStudyDto,
      userId: user.id,
    });
    return study;
  }

  @UseGuards(AccessAuthGuard)
  @Post('join/:studyId/:guestId')
  async joinStudy(
    @User() user: UserAfterAuth,
    @Param() { guestId, studyId },
  ): Promise<MessageResDto> {
    console.log(studyId);
    await this.studiesService.joinStudy({ studyId, hostId: user.id, guestId });

    return { message: '스터디 참여가 완료되었습니다.' };
  }

  @UseGuards(AccessAuthGuard)
  @Delete('out/:studyId')
  async outStudy(
    @Param('studyId') studyId: string,
    @User() user: UserAfterAuth,
  ): Promise<MessageResDto> {
    await this.studiesService.outStudy({ userId: user.id, studyId });

    return { message: '스터디 탈퇴가 완료되었습니다.' };
  }

  @UseGuards(AccessAuthGuard)
  @Delete('forced-exit/:studyId')
  async forcedExitStudy(
    @Body() forcedExitStudyDto: ForcedExitStudyDto,
    @Param('studyId') studyId,
    @User() user: UserAfterAuth,
  ): Promise<MessageResDto> {
    await this.studiesService.forcedExitStudy({
      hostId: user.id,
      studyId,
      forcedExitStudyDto,
    });

    return { message: '스터디 강퇴가 완료되었습니다.' };
  }

  // 화면보고 단일 조회 만들기
  //   @Get('detail/:studyId')
  //   async detail

  @Get()
  async findStudies(@Query() pageReqDto: PageReqDto): Promise<Study[]> {
    const studies = await this.studiesService.findStudies({ pageReqDto });

    return studies;
  }

  @Get('topics')
  async findStudiesByTopic(
    @Query() topicReqDto: TopicReqDto,
  ): Promise<Study[]> {
    const studies = await this.studiesService.findStudiesByTopic({
      topicReqDto,
    });

    return studies;
  }

  @UseGuards(AccessAuthGuard)
  @Get('mypages')
  async findMyStudies(
    @Query() pageReqDto: PageReqDto,
    @User() user: UserAfterAuth,
  ): Promise<Study[]> {
    const studies = await this.studiesService.findByUserId({
      userId: user.id,
      pageReqDto,
    });

    return studies;
  }
}
