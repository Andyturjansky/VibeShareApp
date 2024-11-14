import axios from 'axios';
import { AxiosError } from 'axios';
import { RegisterCredentials, LoginCredentials, AuthResponse } from '@components/auth/types';
import { authStorage } from '../storage/auth';

interface ApiError {
  error: string;
}

const BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (credentials: RegisterCredentials, profilePictureUri?: string) => {
    const formData = new FormData();
    
    // Convertir las credenciales al formato que espera el backend
    const userData = {
      email: credentials.email,
      name: credentials.firstName,
      surname: credentials.lastName,
      username: credentials.username,
      password: credentials.password,
      gender: credentials.gender
    };

    formData.append('userData', JSON.stringify(userData));
    
    if (profilePictureUri) {
      const fileName = profilePictureUri.split('/').pop() || 'profile.jpg';
      const file = {
        uri: profilePictureUri,
        name: fileName,
        type: `image/${fileName.split('.').pop()}`
      };
      
      formData.append('profilePicture', file as any);
    }

    try {
      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(axiosError.response?.data?.error || 'Registration failed');
      }
      throw error;
    }
  },

  login: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(axiosError.response?.data?.error || 'Login failed');
      }
      throw error;
    }
  },

  sendVerificationCode: async (emailOrUsername: string) => {
    const response = await api.post('/auth/send-code', { emailOrUsername });
    return response.data;
  },

  loginWithCode: async (emailOrUsername: string, code: string) => {
    const response = await api.post('/auth/login-with-code', {
      emailOrUsername,
      code
    });
    return response.data;
  }
  
};

export default api;