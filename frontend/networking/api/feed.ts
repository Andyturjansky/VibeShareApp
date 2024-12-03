import api from './axios';
import { Post } from '@components/post/types';
import { BaseBackendPost } from './posts';
import { transformComment } from './comments'

interface FeedResponse {
 posts: Post[];
 hasMore: boolean;
 total: number; 
}

const POSTS_PER_PAGE = 10;

export const transformPost = (backendPost: BaseBackendPost): Post => ({
 id: backendPost._id,
 user: {
   id: backendPost.user._id,
   username: backendPost.user.username,
   profilePicture: backendPost.user.profilePicture || null
  },
 imageUrl: backendPost.media[0]?.url || '',
 location: backendPost.location,
 description: backendPost.title,
 likesCount: backendPost.likeCount,
 isLiked: false, // Se implementará después
 isSaved: false, // Se implementará después
 createdAt: backendPost.date,
 commentsCount: backendPost.comments.length,
 comments: backendPost.comments.map(transformComment),
 mediaType: backendPost.media[0]?.type as 'image' | 'video' || 'image'
});

export const getFeedPosts = async (page: number = 0): Promise<FeedResponse> => {
 try {
   const response = await api.get<BaseBackendPost[]>('/posts');
   const allPosts = response.data.map(transformPost);

   // Aca me aseguro que los posts más recientes estén primero (aunque el backend los trae en orden)
   const sortedPosts = allPosts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
   
   // Paginación del front
   const startIndex = page * POSTS_PER_PAGE;
   const paginatedPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
   const hasMore = startIndex + POSTS_PER_PAGE < allPosts.length;

   return {
     posts: paginatedPosts,
     hasMore,
     total: sortedPosts.length
   };
 } catch (error) {
   console.error('Error fetching feed posts:', error);
   throw error;
 }
};
