import axios from 'axios';
import { authStorage } from '../storage/auth';
import { store } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';

const api = axios.create({
  baseURL: 'https://vibeshareapp.onrender.com'
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await authStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error adding token to request:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('Token expired or invalid');
      await store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;