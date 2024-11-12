import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterCredentials, AuthResponse } from '@components/auth/types';
import { RootState } from '../store';

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials) => {
    // Aca va la llamada a la API
    // return await api.login(credentials);
    throw new Error('Not implemented');
  }
);

// Register Thunk
export const register = createAsyncThunk<AuthResponse, RegisterCredentials>(
  'auth/register',
  async (credentials) => {
    // Aquí irá la llamada real a tu API
    // Ejemplo de respuesta simulada
    try {
      // Simulación de respuesta exitosa
      const response: AuthResponse = {
        user: {
          id: 'temp-id',
          email: credentials.email,
          token: 'temp-token',
          username: credentials.username,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          gender: credentials.gender,
          profilePicture: undefined 
        },
        token: 'temp-token'
      };
      return response;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }
);

export const logout = createAsyncThunk<void, void>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Aca va la llamada a API
      // await api.logout();
      
      // Limpieza local (ej async storage)
      // await AsyncStorage.removeItem('token');
      // await AsyncStorage.removeItem('user');
      
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
      // Aca va la llamada a la API
      // await api.deleteAccount();
      
      // Limpieza local
      // await AsyncStorage.clear();
      
      return;
    } catch (error) {
      return rejectWithValue('Failed to delete account');
    }
  }
);

// Slice
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to login';
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to register';
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
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
      });
  },
});

// Actions
export const { clearError, updateProfilePicture } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;

export default authSlice.reducer;