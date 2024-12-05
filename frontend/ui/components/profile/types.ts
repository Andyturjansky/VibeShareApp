import { Post } from '../post/types';
import { BaseUser } from '../user';

export interface UserProfile extends BaseUser {
  firstName: string;
  lastName: string;
  bio: string;
  gender: 'male' | 'female' | 'other';
  coverPicture: string | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  commentsCount: number;
  isFollowing?: boolean;
}

export interface UserListItem {
  id: string;
  username: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  isFollowing?: boolean;
}

export interface ProfileState {
  currentProfile: UserProfile | null;
  viewedProfile: UserProfile | null;
  userPosts: Post[];
  following: UserListItem[];
  followers: UserListItem[];
  savedPosts: Post[];
  isLoading: boolean;
  error: string | null;
}

export interface SearchUserResult {
  _id: string;
  name: string;
  surname: string;
  username: string;
  profilePicture: string | null;
}