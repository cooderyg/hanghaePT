import { PageReqDto } from 'src/commons/dto/page-req.dto';
import { CreatePostCommentDto } from '../dto/create-post-comment.dto';

export class IPostCommentGetAllComment {
  postId: string;
}

export class IPostCommentCreateComment {
  postId: string;
  userId: string;
  createPostCommentDto: CreatePostCommentDto;
}

export class IPostCommentDeleteComment {
  userId: string;
  commentId: string;
}

export class IPostCommentPutAllComment extends IPostCommentDeleteComment {
  putPostCommentDto: CreatePostCommentDto;
}
