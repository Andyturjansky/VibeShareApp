// redux/thunks/commentThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Comment } from '@components/comment/types';
import { addComment, setError } from '@redux/slices/postsSlice';

// Simular una llamada a API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createComment = createAsyncThunk(
  'posts/createComment',
  async (
    { postId, text, user }: { postId: string; text: string; user: Comment['user'] },
    { dispatch }
  ) => {
    try {
      // Simular llamada API
      await delay(1000);
      
      // Crear nuevo comentario
      const newComment: Comment = {
        id: Date.now().toString(),
        user,
        text,
        createdAt: new Date().toISOString(),
      };

      // Actualizar estado
      dispatch(addComment({ postId, comment: newComment }));
      
      return newComment;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Error creating comment'));
      throw error;
    }
  }
);