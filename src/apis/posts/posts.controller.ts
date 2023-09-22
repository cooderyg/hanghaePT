import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as EPost } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User, UserAfterAuth } from 'src/commons/decorators/user.decorator';
import { AccessAuthGuard } from '../auth/guard/auth.guard';
import { PageReqDto, SearchReqDto } from 'src/commons/dto/page-req.dto';
import { UpdateResult } from 'typeorm';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 게시글 전체조회 & 검색
  @Get()
  async getAllPost(@Query() searchReqDto: SearchReqDto): Promise<EPost[]> {
    const posts = await this.postsService.getAllPost({ searchReqDto });

    return posts;
  }

  // 게시글 개별 조회
  @Get('/:postId')
  async getPost(
    @Param('postId') postId: string,
    @Query() pageReqDto: PageReqDto,
  ): Promise<EPost> {
    const post = await this.postsService.getPostDetail({ postId, pageReqDto });
    return post;
  }

  // 게시글 생성 (질문 공유하기)
  @UseGuards(AccessAuthGuard)
  @Post()
  async createPost(
    @User() user: UserAfterAuth,
    @Body() createPostDto: CreatePostDto,
  ): Promise<EPost> {
    const post = await this.postsService.createPost({
      userId: user.id,
      createPostDto,
    });
    return post;
  }

  // 게시글 수정
  @UseGuards(AccessAuthGuard)
  @Put('/:postId')
  async putPost(
    @Param('postId') postId: string,
    @User() user: UserAfterAuth,
    @Body() createPostDto: CreatePostDto,
  ): Promise<EPost> {
    const post = await this.postsService.putPost({
      userId: user.id,
      postId,
      createPostDto,
    });
    return post;
  }

  // 게시글 삭제
  @UseGuards(AccessAuthGuard)
  @Delete('/:postId')
  async deletePost(
    @Param('postId') postId: string,
    @User() user: UserAfterAuth,
  ): Promise<UpdateResult> {
    const post = await this.postsService.deletePost({
      postId,
      userId: user.id,
    });
    return post;
  }
}
