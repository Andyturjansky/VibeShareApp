import React, { createContext, useContext, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { 
  login as loginAction, 
  saveRegisterData,
  completeRegistration,
  logout as logoutAction,
  deleteAccount as deleteAccountAction,
  selectIsAuthenticated,
  selectUser
} from '@redux/slices/authSlice';
import { UserAuth, RegisterCredentials } from '@components/auth/types'; 

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<RegisterCredentials>;
  finalizeRegistration: () => Promise<void>;
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
      await dispatch(saveRegisterData(credentials)).unwrap();
      return credentials; // Retorna las credenciales para uso posterior
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }, [dispatch]);
  
  const finalizeRegistration = useCallback(async () => {
    try {
      await dispatch(completeRegistration()).unwrap();
    } catch (error) {
      console.error('Complete registration error:', error);
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
    register,
    finalizeRegistration,
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