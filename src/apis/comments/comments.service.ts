import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository, UpdateResult } from 'typeorm';
import { PostsService } from '../posts/posts.service';
import {
  IPostCommentCreateComment,
  IPostCommentDeleteComment,
  IPostCommentGetAllComment,
  IPostCommentPutAllComment,
} from './interfaces/post-comment-service.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly postsService: PostsService,
  ) {}

  // 댓글 전체 조회
  async getAllPostComment({
    postId,
  }: IPostCommentGetAllComment): Promise<Comment[]> {
    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .select([
        'comment.id',
        'comment.comment',
        'comment.createdAt',
        'comment.updatedAt',
        'user.id',
        'user.name',
        'user.profileImgUrl',
      ])
      .leftJoin('comment.user', 'user')
      .where('comment.post.id = :postId', { postId })
      .orderBy({ 'comment.createdAt': 'ASC' })
      .getMany();

    return comments;
  }

  // 댓글 생성
  async createPostComment({
    userId,
    postId,
    createPostCommentDto,
  }: IPostCommentCreateComment): Promise<Comment> {
    const post = await this.postsService.getPost({ postId });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    const commentPost = await this.commentsRepository.save({
      user: { id: userId },
      post: { id: postId },
      ...createPostCommentDto,
    });
    return commentPost;
  }

  // 댓글 수정
  async putPostComment({
    userId,
    commentId,
    putPostCommentDto,
  }: IPostCommentPutAllComment): Promise<Comment> {
    const comment = await this.commentsRepository
      .createQueryBuilder('comment')
      .select([
        'comment.id',
        'comment.comment',
        'comment.createdAt',
        'comment.updatedAt',
        'user.id',
      ])
      .leftJoin('comment.user', 'user')
      .where('comment.id = :commentId', { commentId })
      .getOne();

    if (!comment) throw new NotFoundException('댓글을 찾을 수 없습니다.');

    if (comment.user.id !== userId)
      throw new NotFoundException('권한이 없습니다.');

    comment.comment = putPostCommentDto.comment;
    await this.commentsRepository.save(comment);
    return comment;
  }

  // 댓글 삭제
  async deletePostComment({
    commentId,
    userId,
  }: IPostCommentDeleteComment): Promise<UpdateResult> {
    const comment = await this.commentsRepository
      .createQueryBuilder('comment')
      .select([
        'comment.id',
        'comment.comment',
        'comment.createdAt',
        'comment.updatedAt',
        'user.id',
      ])
      .leftJoin('comment.user', 'user')
      .where('comment.id = :commentId', { commentId })
      .getOne();

    if (!comment) throw new NotFoundException('댓글을 찾을 수 없습니다.');

    if (comment.user.id !== userId)
      throw new NotFoundException('권한이 없습니다.');

    return await this.commentsRepository.softDelete({
      id: commentId,
    });
  }
}
