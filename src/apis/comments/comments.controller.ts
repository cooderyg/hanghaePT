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
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { AccessAuthGuard } from '../auth/guard/auth.guard';
import { User, UserAfterAuth } from 'src/commons/decorators/user.decorator';
import { UpdateResult } from 'typeorm';
import { PageReqDto } from 'src/commons/dto/page-req.dto';

@Controller('api/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 댓글 조회
  @Get()
  async getAllPostComment(
    @Param('postId') postId: string,
    @Query() pageReqDto: PageReqDto,
  ): Promise<Comment[]> {
    const comment = await this.commentsService.getAllPostComment({
      postId,
      pageReqDto,
    });
    return comment;
  }

  // 댓글 생성
  @UseGuards(AccessAuthGuard)
  @Post()
  async createPostComment(
    @Param('postId') postId: string,
    @User() user: UserAfterAuth,
    @Body() createPostCommentDto: CreatePostCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentsService.createPostComment({
      userId: user.id,
      postId,
      createPostCommentDto,
    });
    return comment;
  }

  // 댓글 수정
  @UseGuards(AccessAuthGuard)
  @Put('/:commentId')
  async putPostComment(
    @Param('commentId') commentId: string,
    @User() user: UserAfterAuth,
    @Body() putPostCommentDto: CreatePostCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentsService.putPostComment({
      userId: user.id,
      commentId,
      putPostCommentDto,
    });
    return comment;
  }

  // 댓글 삭제
  @UseGuards(AccessAuthGuard)
  @Delete('/:commentId')
  async deletePostComment(
    @Param('commentId') commentId: string,
    @User() user: UserAfterAuth,
  ): Promise<UpdateResult> {
    const comment = await this.commentsService.deletePostComment({
      commentId,
      userId: user.id,
    });
    return comment;
  }
}
