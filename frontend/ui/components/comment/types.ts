import { BaseUser } from '../user';

export interface Comment {
  id: string;
  user: BaseUser;
  text: string;
  createdAt: string;
}

export interface CommentProps {
  comment: Comment;
  onUserPress?: (userId: string) => void;
}

export interface CommentListProps {
  comments: Comment[];
  onUserPress?: (userId: string) => void;
}

export interface CommentInputProps {
  postId: string;
  onCommentSubmit: (text: string) => void;
  isLoading?: boolean;
}