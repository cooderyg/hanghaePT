import { PageReqDto, SearchReqDto } from 'src/commons/dto/page-req.dto';
import { CreatePostDto } from '../dto/create-post.dto';

export interface IPostsServiceCreatePost {
  userId: string;
  createPostDto: CreatePostDto;
}

export interface IPostsServiceGetAllPost {
  searchReqDto?: SearchReqDto;
}

export interface IPostsServiceGetPostPagination {
  pageReqDto: PageReqDto;
  postId: string;
}

export interface IPostsServiceGetPost {
  postId: string;
}

export interface IPostServicePutPost {
  userId: string;
  postId: string;
  createPostDto: CreatePostDto;
}

export interface IPostServiceDeletePost {
  userId: string;
  postId: string;
}
