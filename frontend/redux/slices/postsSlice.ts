import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '@components/post/types';
import { Comment } from '@components/comment/types';
import { RootState } from '../store';

// Separar las interfaces de payloads complejos
interface AddCommentPayload {
  postId: string;
  comment: Comment;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    createPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    addComment: (state, action: PayloadAction<AddCommentPayload>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.comments.push(action.payload.comment);
        post.commentsCount += 1;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likesCount += post.isLiked ? 1 : -1;
      }
    },
    toggleSave: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.isSaved = !post.isSaved;
      }
    }
  },
});

// Actions
export const { 
  setPosts,
  createPost, 
  addComment, 
  setLoading, 
  setError,
  toggleLike,
  toggleSave
} = postsSlice.actions;

// Selectors
export const selectPosts = (state: RootState) => state.posts.posts;
export const selectLoading = (state: RootState) => state.posts.loading;
export const selectError = (state: RootState) => state.posts.error;
export const selectPostById = (state: RootState, postId: string) => 
  state.posts.posts.find(post => post.id === postId);

export default postsSlice.reducer;