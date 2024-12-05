import axios from 'axios';
import { authStorage } from '../storage/auth';

// Crear una instancia de axios con la URL base
const api = axios.create({
  //baseURL: 'http://localhost:3000',
  baseURL: 'https://vibeshareapp.onrender.com'
});

// Interceptor para añadir el token a todas las peticiones
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

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el error es 401 (no autorizado), podríamos manejar el refresh token aquí
    if (error.response?.status === 401) {
      console.log('Token expired or invalid');
      // Aca va la lógica de refresh token
    }
    return Promise.reject(error);
  }
);

export default api;