import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Like, Repository, UpdateResult } from 'typeorm';
import {
  IPostServiceDeletePost,
  IPostServicePutPost,
  IPostsServiceCreatePost,
  IPostsServiceGetAllPost,
  IPostsServiceGetPost,
  IPostsServiceGetPostPagination,
} from './interfaces/post-service.interfaces';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  // 게시글 전체 조회 & 검색
  async getAllPost({
    searchReqDto,
  }: IPostsServiceGetAllPost): Promise<[Post[], number]> {
    const { page, size, keyword } = searchReqDto;

    // 키워드 없이 전체조회
    if (keyword === undefined) {
      const posts = await this.postsRepository
        .createQueryBuilder('post')
        .select([
          'post.id',
          'post.title',
          'post.content',
          'post.createdAt',
          'user.name',
          'user.profileImgUrl',
        ])
        .leftJoin('post.user', 'user')
        .orderBy('post.createdAt', 'DESC')
        .getMany();

      const count = await this.postsRepository.count({
        order: { createdAt: 'DESC' },
        take: size,
        skip: (page - 1) * size,
      });

      return [posts, count];
    }
    // 검색하여 조회
    else if (keyword) {
      const posts = await this.postsRepository
        .createQueryBuilder('post')
        .select([
          'post.id',
          'post.title',
          'post.content',
          'post.createdAt',
          'user.name',
          'user.profileImgUrl',
        ])
        .leftJoin('post.user', 'user')
        .where('post.title like :keyword', { keyword: `%${keyword}%` })
        .orWhere('post.content like :keyword', { keyword: `%${keyword}%` })
        .orderBy('post.createdAt', 'DESC')
        .getMany();

      const count = await this.postsRepository.count({
        where: [
          { title: Like(`%${keyword}%`) },
          { content: Like(`%${keyword}%`) },
        ],
        order: { createdAt: 'DESC' },
        take: size,
        skip: (page - 1) * size,
      });

      return [posts, count];
    }
  }

  // 게시글 개별 조회
  async getPost({ postId }: IPostsServiceGetPost): Promise<Post> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.createdAt',
        'post.updatedAt',
        'user.id',
        'user.profileImgUrl',
      ])
      .leftJoin('post.user', 'user')
      .where('post.id = :postId', { postId })
      .getOne();
    if (!post) throw new NotFoundException('게시글 조회 실패');
    return post;
  }

  // 게시글 디테일 페이지 조회
  async getPostDetail({
    postId,
    pageReqDto,
  }: IPostsServiceGetPostPagination): Promise<Post> {
    const { page, size } = pageReqDto;

    const post = await this.postsRepository
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.createdAt',
        'post.updatedAt',
        'user.id',
        'user.name',
      ])
      .leftJoin('post.user', 'user')
      .where('post.id = :postId', { postId })
      .take(size)
      .skip((page - 1) * size)
      .getOne();
    if (!post) throw new NotFoundException('게시글 조회 실패');
    return post;
  }

  // 게시글 생성
  async createPost({
    userId,
    createPostDto,
  }: IPostsServiceCreatePost): Promise<Post> {
    const post = await this.postsRepository.save({
      user: { id: userId },
      ...createPostDto,
    });
    return post;
  }

  // 게시글 수정
  async putPost({
    userId,
    postId,
    createPostDto,
  }: IPostServicePutPost): Promise<Post> {
    const post = await this.getPost({ postId });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    if (post.user.id !== userId)
      throw new NotFoundException('권한이 없습니다.');

    post.title = createPostDto.title;
    post.content = createPostDto.content;
    await this.postsRepository.save(post);
    return post;
  }

  // 게시글 삭제
  async deletePost({
    postId,
    userId,
  }: IPostServiceDeletePost): Promise<UpdateResult> {
    const post = await this.getPost({ postId });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    if (post.user.id !== userId)
      throw new NotFoundException('권한이 없습니다.');

    return await this.postsRepository.softDelete({
      id: postId,
    });
  }
}
