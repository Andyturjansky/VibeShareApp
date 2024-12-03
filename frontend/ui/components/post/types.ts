import { BaseUser } from '../user';
import { Comment } from '../comment/types';  
  
  export interface Post {
    id: string;
    user: BaseUser;
    imageUrl: string;
    location: string;
    description: string;
    likesCount: number;
    isLiked: boolean;
    isSaved: boolean;
    createdAt: string;
    commentsCount: number;
    comments: Comment[];
    mediaType: 'image' | 'video';
  }
  
  export interface PostProps {
    post: Post;
    onLikePress?: (postId: string) => void;
    onCommentPress?: (postId: string) => void;
    onSavePress?: (postId: string) => void;
    onUserPress?: (userId: string) => void;
    onImagePress?: (postId: string) => void;
  }
  
  export interface PostHeaderProps {
    user: BaseUser;
    location?: string;
    createdAt: string;
    onUserPress?: (userId: string) => void;
  }
  
  export interface PostImageProps {
    imageUrl: string;
    mediaType: 'image' | 'video';
    postId: string;
    onLike?: (postId: string) => void;
    onExpand?: () => void;
  }
  
  export interface PostActionsProps {
    postId: string;
    isLiked: boolean;
    isSaved: boolean;
    commentsCount: number;
    onLikePress: (postId: string) => void;
    onCommentPress: (postId: string) => void;
    onSavePress: (postId: string) => void;
  }
  
  export interface PostDescriptionProps {
    description: string;
    likesCount: number;
    onUserPress?: (userId: string) => void;
  }