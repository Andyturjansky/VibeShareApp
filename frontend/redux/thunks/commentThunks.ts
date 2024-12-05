import { createAsyncThunk } from '@reduxjs/toolkit';
import { addComment as addCommentApi } from '@networking/api/comments';
import { updatePost, setError } from '@redux/slices/postsSlice';
import { transformPost } from '@networking/api/feed'; // Importar la función de transformación

export const createCommentThunk = createAsyncThunk(
  'posts/createComment',
  async (
    { postId, text }: { postId: string; text: string },
    { dispatch }
  ) => {
    try {
      const response = await addCommentApi(postId, text);
      
      // Transformamos el post al formato que espera el frontend
      const transformedPost = transformPost(response.post);
      
      // Actualizamos el post en el estado
      dispatch(updatePost(transformedPost));
      
      return transformedPost;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error creating comment';
      dispatch(setError(errorMessage));
      throw error;
    }
  }
);