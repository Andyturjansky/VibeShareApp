// networking/api/comments.ts
import api from './axios';
import { BaseBackendPost } from './posts';

interface BackendComment {
  _id: string | { toString(): string };
  user: string | { toString(): string } | {
    _id: string | { toString(): string };
    name?: string;
    username: string;
  };
  text: string;
  date: string;
}

interface AddCommentResponse {
  message: string;
  post: BaseBackendPost;
}

// Función para transformar el formato de los comentarios
export const transformComment = (comment: BackendComment) => {
  return {
    id: typeof comment._id === 'object' ? comment._id.toString() : comment._id,
    text: comment.text,
    createdAt: comment.date,
    user: {
      id: typeof comment.user === 'object' 
        ? 'username' in comment.user 
          ? comment.user._id.toString()
          : comment.user.toString()
        : comment.user,
      username: typeof comment.user === 'object' && 'username' in comment.user 
        ? comment.user.username 
        : 'Unknown User',
      profilePicture: null
    }
  };
};

// Función para hacer la llamada al API
export const addComment = async (postId: string, text: string): Promise<AddCommentResponse> => {
  try {
    const response = await api.post<AddCommentResponse>(
      `/posts/${postId}/comment`,
      {
        postId,
        text
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};