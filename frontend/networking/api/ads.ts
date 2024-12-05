import api from './axios';

export const getAds = async () => {
  try {
    const response = await api.get('/api/ads');
    return response.data;
  } catch (error) {
    console.error('Error fetching ads:', error);
    throw error;
  }
};