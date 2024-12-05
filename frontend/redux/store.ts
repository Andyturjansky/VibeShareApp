import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import adsReducer from './slices/adsSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    auth: authReducer,
    posts: postsReducer,
    ads: adsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;