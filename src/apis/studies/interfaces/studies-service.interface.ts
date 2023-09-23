import {
  PageReqDto,
  SearchReqDto,
  TopicReqDto,
} from 'src/commons/dto/page-req.dto';
import { CreateStudyDto } from '../dto/create-study.dto';
import { ForcedExitStudyDto } from '../dto/forcedExit-study.dto';
import { UpdateStudyDto } from '../dto/update-study.dto';

export interface IStudiesServiceCreateStudy {
  createStudyDto: CreateStudyDto;
  userId: string;
}

export interface IStudiesServiceJoinStudy {
  studyId: string;
  userId: string;
}

export interface IStudiesServiceUpdateStudy {
  userId: string;
  studyId: string;
  updateStudyDto: UpdateStudyDto;
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

export interface IStudiesServiceFindStudyDetail {
  studyId: string;
}

export interface IStudiesServiceFindUserStudy {
  userId: string;
  studyId: string;
}

export interface IStudiesServiceFindStudies {
  searchReqDto: SearchReqDto;
}

export interface IStudiesServiceFindStudiesByTopic {
  topicReqDto: TopicReqDto;
}

export interface IStudiesServiceFindByUserId {
  userId: string;
  pageReqDto: PageReqDto;
}
