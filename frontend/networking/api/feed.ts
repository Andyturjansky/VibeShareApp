import api from './axios';
import { Post } from '@components/post/types';
import { BaseBackendPost } from './posts';
import { transformComment } from './comments';
import { store } from '@redux/store';

interface FeedResponse {
  posts: Post[];
  hasMore: boolean;
  total: number;
}


const POSTS_PER_PAGE = 10;

export const transformPost = (backendPost: BaseBackendPost): Post => {
  // Obtener el usuario actual del store
  const currentUser = store.getState().auth.user;
  
  return {
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
    isLiked: currentUser ? backendPost.likes.some(like => like.userId === currentUser.id) : false,
    isSaved: false, // Se actualizará después con los favoritos
    createdAt: backendPost.date,
    commentsCount: backendPost.comments.length,
    comments: backendPost.comments.map(transformComment),
    mediaType: backendPost.media[0]?.type as 'image' | 'video' || 'image'
  };
};

export const getFeedPosts = async (page: number = 0): Promise<FeedResponse> => {
  try {
    const currentUser = store.getState().auth.user;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Obtener posts y favoritos en paralelo
    const [postsResponse, favoritesResponse] = await Promise.all([
      api.get<BaseBackendPost[]>('/posts/following'),
      api.get<{ favorites: Array<{ _id: string }> }>(`/user/favorites/${currentUser.username}`)
    ]);

    const userFavorites = favoritesResponse.data.favorites.map(post => post._id);
    const allPosts = postsResponse.data.map(post => ({
      ...transformPost(post),
      isSaved: userFavorites.includes(post._id)
    }));

    // Ordenar por fecha
    const sortedPosts = allPosts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const startIndex = page * POSTS_PER_PAGE;
    const paginatedPosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    return {
      posts: paginatedPosts,
      hasMore: startIndex + POSTS_PER_PAGE < sortedPosts.length,
      total: sortedPosts.length
    };
  } catch (error) {
    console.error('Error fetching feed posts:', error);
    throw error;
  }
};