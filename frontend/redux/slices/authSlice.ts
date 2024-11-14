import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterCredentials, AuthResponse } from '@components/auth/types';
import { RootState } from '../store';
import { authApi } from '@networking/api/auth';
import { authStorage } from '@networking/storage/auth';

interface RegisterState {
  tempUserData: RegisterCredentials | null;
  tempProfilePicture: string | null;
}

const initialState: AuthState & RegisterState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  tempUserData: null,
  tempProfilePicture: null,
};

// Primer paso: guardar datos del registro
export const saveRegisterData = createAsyncThunk<void, RegisterCredentials>(
  'auth/saveRegisterData',
  async (credentials, { dispatch }) => {
    dispatch(setTempUserData(credentials));
  }
);

// Segundo paso: completar registro con/sin foto
export const completeRegistration = createAsyncThunk<AuthResponse, void>(
  'auth/completeRegistration',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { tempUserData, tempProfilePicture } = state.auth;

      if (!tempUserData) {
        throw new Error('No user data available');
      }

      const response = await authApi.register(tempUserData, tempProfilePicture || undefined);
      return response;
    } catch (error : any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to register');
    }
  }
);

export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      
      return {
        user: {
          id: response.user.id,
          email: response.user.email,
          token: response.token,
          username: response.user.username,
          firstName: response.user.name,
          lastName: response.user.surname,
          gender: response.user.gender,
          profilePicture: response.user.profilePicture
        },
        token: response.token
        }
    } catch (error : any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to login');
    }
  }
);

export const logout = createAsyncThunk<void, void>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Aquí podríamos agregar la llamada a la API si es necesario
      // await authApi.logout();
      return;
    } catch (error) {
      return rejectWithValue('Failed to logout');
    }
  }
);

export const deleteAccount = createAsyncThunk<void, void>(
  'auth/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      // Aquí podríamos agregar la llamada a la API si es necesario
      // await authApi.deleteAccount();
      return;
    } catch (error) {
      return rejectWithValue('Failed to delete account');
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    const [token, user] = await Promise.all([
      authStorage.getToken(),
      authStorage.getUser()
    ]);
    
    if (token && user) {
      return { token, user };
    }
    return null;
  }
);

export const sendVerificationCode = createAsyncThunk<{ message: string }, string>(
  'auth/sendVerificationCode',
  async (emailOrUsername, { rejectWithValue }) => {
    try {
      const response = await authApi.sendVerificationCode(emailOrUsername);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send code');
    }
  }
);


export const verifyCode = createAsyncThunk<AuthResponse, { emailOrUsername: string; code: string }>(
  'auth/verifyCode',
  async ({ emailOrUsername, code }, { rejectWithValue }) => {
    try {
      const response = await authApi.loginWithCode(emailOrUsername, code);
      return {
        user: {
          id: response.user.id,
          email: response.user.email,
          token: response.token,
          username: response.user.username,
          firstName: response.user.name,
          lastName: response.user.surname,
          gender: response.user.gender,
          profilePicture: response.user.profilePicture
        },
        token: response.token
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Invalid code');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateProfilePicture: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          profilePicture: action.payload
        };
      }
    },
    setTempUserData: (state, action: PayloadAction<RegisterCredentials>) => {
      state.tempUserData = action.payload;
    },
    setTempProfilePicture: (state, action: PayloadAction<string>) => {
      state.tempProfilePicture = action.payload;
    },
    clearTempData: (state) => {
      state.tempUserData = null;
      state.tempProfilePicture = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // SaveRegisterData
      .addCase(saveRegisterData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveRegisterData.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(saveRegisterData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to save registration data';
      })

      // CompleteRegistration
      .addCase(completeRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.tempUserData = null;
        state.tempProfilePicture = null;
        authStorage.saveToken(action.payload.token);
        authStorage.saveUser(action.payload.user);
      })

      .addCase(completeRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to complete registration';
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        authStorage.saveToken(action.payload.token);
        authStorage.saveUser(action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to login';
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        authStorage.clearAuth();
        return initialState; // Resetea todo el estado a los valores iniciales
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to logout';
      })
      
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        return initialState; // Resetea todo el estado a los valores iniciales
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete account';
      })
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
      })

          // Send Verification Code
    .addCase(sendVerificationCode.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(sendVerificationCode.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    })
    .addCase(sendVerificationCode.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })

    // Verify Code
    .addCase(verifyCode.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(verifyCode.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      authStorage.saveToken(action.payload.token);
      authStorage.saveUser(action.payload.user);
    })
    .addCase(verifyCode.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
      
  },
});

// Actions
export const { 
  clearError, 
  updateProfilePicture, 
  setTempUserData, 
  setTempProfilePicture, 
  clearTempData 
} = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;

export default authSlice.reducer;