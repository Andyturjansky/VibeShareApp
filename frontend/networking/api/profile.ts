import { createAsyncThunk } from '@reduxjs/toolkit';
import api  from './axios';
import { UserProfile, UserListItem } from '@components/profile/types';
import { Post } from '@components/post/types';
import { BaseBackendPost } from './posts';
import { transformPost } from './feed';
import { authStorage } from '../storage/auth';

interface UserStats {
  postCount: number;
  followerCount: number;
  followingCount: number;
  commentCount: number;
}

export const profileAPI = {
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    try {
      // Obtener datos del usuario
      const userResponse = await api.get<any>(`/user/${userId}`);
      const user = userResponse.data;
      //console.log('User data from API:', user);
      
      // Obtener estadísticas usando el username
      const statsResponse = await api.get<UserStats>(`/user/stats/${user.username}`);
      const stats = statsResponse.data;
      //console.log('Stats from API:', stats);

      const currentUser = await authStorage.getUser();
      const isFollowing = user.followers.includes(currentUser?.id);

      // Mapear la respuesta al formato UserProfile
      return {
        id: user._id,
        username: user.username,
        firstName: user.name, 
        lastName: user.surname, 
        bio: user.bio || '',
        gender: user.gender,
        profilePicture: user.profilePicture || '',
        coverPicture: user.coverPicture || null,
        followersCount: stats.followerCount,
        followingCount: stats.followingCount,
        postsCount: stats.postCount,
        commentsCount: stats.commentCount,
        isFollowing: isFollowing
      };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
  },
  
  getStatsByUsername: (username: string) => 
    api.get<UserProfile>(`/user/stats/${username}`),
  
  getUserPosts: async () => {
    try {
      const response = await api.get<BaseBackendPost[]>('/posts/user');
      return {
        data: response.data.map(transformPost),
      };
    } catch (error) {
      console.error('Error in getUserPosts:', error);
      throw error;
    }
  },
  
  getFollowers: async (username: string) => {
    const response = await api.get(`/user/followers/${username}`);
    return response.data.followers;
  },

  getFollowing: async (username: string) => {
    const response = await api.get(`/user/following/${username}`);
    return response.data.following;
  },
  
  followUser: (username: string) => 
    api.post(`/user/follow/${username}`),

  unfollowUser: (username: string) => 
    api.post(`/user/unfollow/${username}`),
  
  updateProfile: async (data: Partial<UserProfile>) => 
    api.put('/user/profile', {
      name: data.firstName,
      surname: data.lastName,
      username: data.username,
      bio: data.bio,
      gender: data.gender
    }),

  updateProfilePicture: async (formData: FormData) =>
    api.post('/user/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }),

  updateCoverPicture: async (formData: FormData) =>
    api.post('/user/cover-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }),

  getFavorites: (username: string) => 
    api.get(`/user/favorites/${username}`),

  searchUsers: async (searchParams: { name?: string; surname?: string; username?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (searchParams.name) queryParams.append('name', searchParams.name);
    if (searchParams.surname) queryParams.append('surname', searchParams.surname);
    if (searchParams.username) queryParams.append('username', searchParams.username);
    
    const response = await api.get(`/user/search?${queryParams.toString()}`);
    return response.data;
  }
};
