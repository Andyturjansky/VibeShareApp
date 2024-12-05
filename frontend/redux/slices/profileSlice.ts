import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileAPI } from '@networking/api/profile';
import { UserProfile, UserListItem, ProfileState } from '@components/profile/types';
import { Post } from '@components/post/types';
import { RootState } from '../store';
import { authStorage } from '@networking/storage/auth';

const initialState: ProfileState = {
  currentProfile: null,
  viewedProfile: null,
  following: [],
  followers: [],
  savedPosts: [],
  userPosts: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk<UserProfile, string>(
  'profile/fetchUserProfile',
  async (userId: string) => {
    try {
      const profile = await profileAPI.getUserProfile(userId);
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
);
/*
export const updateUserProfile = createAsyncThunk<UserProfile, Partial<UserProfile>, { rejectValue: string }>(
  'profile/updateUserProfile',
  async (profileData: Partial<UserProfile>) => {
    const updatedProfile: UserProfile = {
      id: '1',
      username: 'updatedUser',
      firstName: profileData.firstName || 'Updated',
      lastName: profileData.lastName || 'User',
      bio: profileData.bio || 'Updated bio',
      gender: profileData.gender || 'other',
      profilePicture: profileData.profilePicture || '',
      coverPicture: profileData.coverPicture || null,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      commentsCount: 0,
    };
    return updatedProfile;
  }
);

interface ToggleFollowResponse {
  userId: string;
  isFollowing: boolean;
}

*/

export const toggleFollowUser = createAsyncThunk<{message: string, following: string[]}, string>(
  'profile/toggleFollowUser',
  async (username: string, { getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const isFollowing = state.profile.viewedProfile?.isFollowing;
      
      let response;
      if (isFollowing) {
        response = await profileAPI.unfollowUser(username);
      } else {
        response = await profileAPI.followUser(username);
      }

      // Después de toggle, recargamos el perfil para tener datos actualizados
      if (state.profile.viewedProfile?.id) {
        dispatch(fetchUserProfile(state.profile.viewedProfile.id));
      }

      return response.data;
    } catch (error) {
      console.error('Error in toggleFollowUser:', error);
      throw error;
    }
  }
);

export const fetchUserPosts = createAsyncThunk<Post[]>(
  'profile/fetchUserPosts',
  async () => {
    const response = await profileAPI.getUserPosts();
    return response.data;
  }
);

export const fetchFollowers = createAsyncThunk<UserListItem[], string>(
  'profile/fetchFollowers',
  async (username: string) => {
    const followers = await profileAPI.getFollowers(username);
    return followers.map((follower: any) => ({
      id: follower._id,
      username: follower.username,
      firstName: follower.name,
      lastName: follower.surname,
      profilePicture: follower.profilePicture,
    }));
  }
);

export const fetchFollowing = createAsyncThunk<UserListItem[], string>(
  'profile/fetchFollowing',
  async (username: string) => {
    const following = await profileAPI.getFollowing(username);
    return following.map((user: any) => ({
      id: user._id,
      username: user.username,
      firstName: user.name,
      lastName: user.surname,
      profilePicture: user.profilePicture,
    }));
  }
);

export const loadInitialProfile = createAsyncThunk(
  'profile/loadInitialProfile',
  async (_, { dispatch }) => {
    try {
      const userData = await authStorage.getUser();
      console.log('User data from storage:', userData);
      
      if (userData?.id) {
        return await profileAPI.getUserProfile(userData.id);
      }
      throw new Error('No user ID found in storage');
    } catch (error) {
      console.error('Error loading initial profile:', error);
      throw error;
    }
  }
);

export const updateUserProfile = createAsyncThunk<UserProfile, Partial<UserProfile>>(
  'profile/updateUserProfile',
  async (profileData) => {
    const response = await profileAPI.updateProfile(profileData);
    return response.data;
  }
);

export const updateProfileImage = createAsyncThunk<{user: UserProfile}, FormData>(
  'profile/updateProfileImage',
  async (formData) => {
    const response = await profileAPI.updateProfilePicture(formData);
    return response.data; // Esto ya incluye {message, user}
  }
);

export const updateCoverImage = createAsyncThunk<{user: UserProfile}, FormData>(
  'profile/updateCoverImage',
  async (formData) => {
    const response = await profileAPI.updateCoverPicture(formData);
    return response.data; // Esto ya incluye {message, user}
  }
);

// Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setCurrentProfile: (state, action: PayloadAction<UserProfile>) => {
      state.currentProfile = action.payload;
    },
    setViewedProfile: (state, action: PayloadAction<UserProfile>) => {
      state.viewedProfile = action.payload;
    },
    setFollowing: (state, action: PayloadAction<UserListItem[]>) => {
      state.following = action.payload;
    },
    setFollowers: (state, action: PayloadAction<UserListItem[]>) => {
      state.followers = action.payload;
    },
    setSavedPosts: (state, action: PayloadAction<Post[]>) => {
      state.savedPosts = action.payload;
    },
    setUserPosts: (state, action: PayloadAction<Post[]>) => {
      state.userPosts = action.payload;
    },
    clearViewedProfile: (state) => {
      state.viewedProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        const userData = action.payload;
        if (!action.meta.arg || action.meta.arg === state.currentProfile?.id) {
          state.currentProfile = userData;
        } else {
          state.viewedProfile = userData;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error al cargar el perfil';
      })
      .addCase(toggleFollowUser.fulfilled, (state, action) => {
        if (state.viewedProfile) {
          state.viewedProfile.isFollowing = !state.viewedProfile.isFollowing;
          state.viewedProfile.followersCount += state.viewedProfile.isFollowing ? 1 : -1;
          
          if (state.currentProfile) {
            state.currentProfile.followingCount += state.viewedProfile.isFollowing ? 1 : -1;
          }
        }
        console.log('Follow state updated:', {
          isFollowing: state.viewedProfile?.isFollowing,
          followersCount: state.viewedProfile?.followersCount,
          followingCount: state.currentProfile?.followingCount
        });
      })
      .addCase(loadInitialProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadInitialProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
      })
      .addCase(loadInitialProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error loading profile';
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPosts = action.payload;
        console.log('Posts saved in state:', state.userPosts); // Para debug
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error al cargar los posts';
        state.userPosts = [];
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        const updatedUser = action.payload.user; // Accedemos a user dentro de la respuesta
        if (state.currentProfile) {
          state.currentProfile = {
            ...state.currentProfile,
            profilePicture: updatedUser.profilePicture
          };
        }
        if (state.viewedProfile) {
          state.viewedProfile = {
            ...state.viewedProfile,
            profilePicture: updatedUser.profilePicture
          };
        }
      })
      .addCase(updateCoverImage.fulfilled, (state, action) => {
        const updatedUser = action.payload.user; // Accedemos a user dentro de la respuesta
        if (state.currentProfile) {
          state.currentProfile = {
            ...state.currentProfile,
            coverPicture: updatedUser.coverPicture
          };
        }
        if (state.viewedProfile) {
          state.viewedProfile = {
            ...state.viewedProfile,
            coverPicture: updatedUser.coverPicture
          };
        }
      })
      .addCase(fetchFollowing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.following = action.payload;
        console.log('Following updated in state:', action.payload); // Para debug
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error al cargar following';
        console.error('Error fetching following:', action.error); // Para debug
      })
      .addCase(fetchFollowers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.followers = action.payload;
        console.log('Followers updated in state:', action.payload); // Para debug
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error al cargar followers';
        console.error('Error fetching followers:', action.error); // Para debug
      })
  },
});

// Actions
export const {
  setCurrentProfile,
  setViewedProfile,
  setFollowing,
  setFollowers,
  setSavedPosts,
  setUserPosts,
  clearViewedProfile,
} = profileSlice.actions;

// Selectors
export const selectCurrentProfile = (state: { profile: ProfileState }) => state.profile.currentProfile;
export const selectViewedProfile = (state: { profile: ProfileState }) => state.profile.viewedProfile;
export const selectFollowing = (state: { profile: ProfileState }) => state.profile.following;
export const selectFollowers = (state: { profile: ProfileState }) => state.profile.followers;
export const selectSavedPosts = (state: { profile: ProfileState }) => state.profile.savedPosts;
export const selectUserPosts = (state: { profile: ProfileState }) => state.profile.userPosts;
export const selectIsLoading = (state: { profile: ProfileState }) => state.profile.isLoading;
export const selectError = (state: { profile: ProfileState }) => state.profile.error;

export default profileSlice.reducer;