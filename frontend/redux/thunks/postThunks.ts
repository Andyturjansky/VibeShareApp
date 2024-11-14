import { createAsyncThunk } from '@reduxjs/toolkit';
import { createPost as createPostAction, setLoading, setError } from '../slices/postsSlice';
import { createPostWithMedia } from '@networking/api/posts';
import { Post } from '@components/post/types';
import { RootState } from '../store';

interface CreatePostParams {
  mediaUri: string;
  mediaType: 'image' | 'video';
  caption: string;
  location: string;
}

export const createPostThunk = createAsyncThunk<Post, CreatePostParams>(
  'posts/createPost',
  async (params, { dispatch, getState, rejectWithValue }) => {
    console.log('CreatePostThunk started with params:', params); // Debug log
    
    try {
      dispatch(setLoading(true));
      
      const state = getState() as RootState;
      const currentUser = state.auth.user;
      
      console.log('Current user:', currentUser); // Debug log
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      console.log('Calling createPostWithMedia...'); // Debug log
      const newPost = await createPostWithMedia(params, currentUser);
      console.log('Post created:', newPost); // Debug log
      
      dispatch(createPostAction(newPost));
      return newPost;
      
    } catch (error: any) {
      console.error('Error in createPostThunk:', error); // Debug error log
      console.error('Error details:', {
        response: error.response?.data,
        message: error.message
      }); // Debug error details
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create post';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
      
    } finally {
      dispatch(setLoading(false));
    }
  }
);