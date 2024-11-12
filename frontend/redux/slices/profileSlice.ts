import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, UserListItem, ProfileState } from '@components/profile/types';
import { Post } from '@components/post/types';

// Estado inicial
// Coomentado para hacer testing
/*
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
*/

const initialState: ProfileState = {
  currentProfile: {
    id: '1',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    bio: 'This is a test bio',
    gender: 'other',
    profilePicture: '',
    coverPicture: null,
    followersCount: 100,
    followingCount: 50,
    postsCount: 25,
    commentsCount: 75,
  },
  viewedProfile: null,
  following: [],
  followers: [],
  savedPosts: [],
  userPosts: [
    {
      id: '1',
      user: {
        id: 'user1',
        username: 'john_doe',
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      imageUrl: 'https://picsum.photos/500/500',
      location: 'New York, NY', 
      description: 'Beautiful day! 🌞 #sunshine #happiness',
      likesCount: 142,
      commentsCount: 12,
      isLiked: false,
      isSaved: false,
      createdAt: '2024-10-01',
      comments: [],
      mediaType: 'image'
    }
  ],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk<UserProfile, string>(
  'profile/fetchUserProfile',
  async (userId: string) => {
    const mockProfile: UserProfile = {
      id: userId,
      username: 'mockUser',
      firstName: 'Mock',
      lastName: 'User',
      bio: 'Mock bio',
      gender: 'other',
      profilePicture: '',
      coverPicture: null,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      commentsCount: 0,
    };
    return mockProfile;
  }
);

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

export const toggleFollowUser = createAsyncThunk<ToggleFollowResponse, string, { rejectValue: string }>(
  'profile/toggleFollowUser',
  async (userId: string) => {
    return {
      userId,
      isFollowing: true,
    };
  }
);

export const fetchUserPosts = createAsyncThunk<Post[], string>(
  'profile/fetchUserPosts',
  async (userId: string) => {
    return []; // Por ahora retornamos array vacío
  }
);

export const fetchFollowing = createAsyncThunk<UserListItem[], string>(
  'profile/fetchFollowing',
  async (userId: string) => {
    // Aquí irá la llamada a tu API
    // return await api.getFollowing(userId);
    return []; // Por ahora retornamos array vacío
  }
);

export const fetchFollowers = createAsyncThunk<UserListItem[], string>(
  'profile/fetchFollowers',
  async (userId: string) => {
    // Aquí irá la llamada a tu API
    // return await api.getFollowers(userId);
    return []; // Por ahora retornamos array vacío
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
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.viewedProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error al cargar el perfil';
      })
      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const updatedProfile = action.payload;
        if (state.currentProfile?.id === updatedProfile.id) {
          state.currentProfile = { ...state.currentProfile, ...updatedProfile };
        }
        if (state.viewedProfile?.id === updatedProfile.id) {
          state.viewedProfile = { ...state.viewedProfile, ...updatedProfile };
        }
      })
      // Toggle Follow
      .addCase(toggleFollowUser.fulfilled, (state, action) => {
        if (state.viewedProfile && state.viewedProfile.id === action.payload.userId) {
          state.viewedProfile.isFollowing = action.payload.isFollowing;
          state.viewedProfile.followersCount += action.payload.isFollowing ? 1 : -1;
        }
      })
      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar los posts';
        state.isLoading = false;
      });
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


/*
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, UserListItem, ProfileState } from '@components/profile/types';
import { Post } from '@components/post/types';

// Estado inicial
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
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId: string) => {
    // Aquí irá la llamada a tu API
    // return await api.getProfile(userId);
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData: Partial<UserProfile>) => {
    // Aquí irá la llamada a tu API
    // return await api.updateProfile(profileData);
  }
);

export const toggleFollowUser = createAsyncThunk(
  'profile/toggleFollowUser',
  async (userId: string) => {
    // Aquí irá la llamada a tu API
    // return await api.toggleFollow(userId);
  }
);

export const fetchUserPosts = createAsyncThunk<Post[], string>(
  'profile/fetchUserPosts',
  async (userId: string) => {
    // Aquí irá la llamada a tu API
    // return await api.getUserPosts(userId);
    return []; // Por ahora retornamos array vacío
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
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.viewedProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error al cargar el perfil';
      })
      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.currentProfile?.id === action.payload.id) {
          state.currentProfile = { ...state.currentProfile, ...action.payload };
        }
        if (state.viewedProfile?.id === action.payload.id) {
          state.viewedProfile = { ...state.viewedProfile, ...action.payload };
        }
      })
      // Toggle Follow
      .addCase(toggleFollowUser.fulfilled, (state, action) => {
        if (state.viewedProfile) {
          state.viewedProfile.isFollowing = !state.viewedProfile.isFollowing;
          state.viewedProfile.followersCount += state.viewedProfile.isFollowing ? 1 : -1;
        }
      })
      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.error = action.error.message || 'Error al cargar los posts';
        state.isLoading = false;
      });
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

*/