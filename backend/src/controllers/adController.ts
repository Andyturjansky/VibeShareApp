import axios from 'axios';

interface AdImagePath {
  portraite: string;
  landscape: string;
}

interface Ad {
  commerce: string;
  date: {
    start: number;
    end: number;
  };
  imagePath: AdImagePath[];
  Url: string;
}

class AdController {
  private static ADS_URL = 'https://my-json-server.typicode.com/chrismazzeo/advertising_da1/ads';
  private static cache: Ad[] | null = null;
  private static lastFetch: number = 0;
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

  static async getAds() {
    try {
      // Si hay caché válido, retornarlo
      if (
        AdController.cache &&
        Date.now() - AdController.lastFetch < AdController.CACHE_DURATION
      ) {
        return AdController.cache;
      }

      // Si no hay caché o expiró, hacer nueva petición
      const response = await axios.get<Ad[]>(AdController.ADS_URL);
      
      // Actualizar caché
      AdController.cache = response.data;
      AdController.lastFetch = Date.now();

      return response.data;
    } catch (error) {
      console.error('Error fetching ads:', error);
      throw error;
    }
  }
}

export default AdController;