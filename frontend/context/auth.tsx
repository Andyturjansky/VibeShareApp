// context/auth.tsx
import React, { createContext, useContext, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { 
  login as loginAction, 
  register as registerAction,
  logout as logoutAction,
  deleteAccount as deleteAccountAction,
  selectIsAuthenticated,
  selectUser
} from '@redux/slices/authSlice';
import { UserAuth, RegisterCredentials } from '@components/auth/types'; 

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>; 
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  user: UserAuth | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await dispatch(loginAction({ email, password })).unwrap();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [dispatch]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      await dispatch(registerAction(credentials)).unwrap();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAction()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, [dispatch]);

  const deleteAccount = useCallback(async () => {
    try {
      await dispatch(deleteAccountAction()).unwrap();
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }, [dispatch]);

  const value = {
    isAuthenticated,
    login,
    register, // Añadido
    logout,
    deleteAccount,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};