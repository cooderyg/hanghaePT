import { PageReqDto, TopicReqDto } from 'src/commons/dto/page-req.dto';
import { CreateStudyDto } from '../dto/create-study.dto';
import { ForcedExitStudyDto } from '../dto/forcedExit-study.dto';

export interface IStudiesServiceCreateStudy {
  createStudyDto: CreateStudyDto;
  userId: string;
}

export interface IStudiesServiceJoinStudy {
  studyId: string;
  hostId: string;
  guestId: string;
}

export interface IStudiesServiceOutStudy {
  userId: string;
  studyId: string;
}

export interface IStudiesServiceForcedExitStudy {
  hostId: string;
  studyId: string;
  forcedExitStudyDto: ForcedExitStudyDto;
}

export interface IStudiesServiceFindUserStudy {
  userId: string;
  studyId: string;
}

export interface IStudiesServiceFindStudies {
  pageReqDto: PageReqDto;
}

export interface IStudiesServiceFindStudiesByTopic {
  topicReqDto: TopicReqDto;
}

export interface IStudiesServiceFindByUserId {
  userId: string;
  pageReqDto: PageReqDto;
}
