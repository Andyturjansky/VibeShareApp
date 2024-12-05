import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { GOOGLE_MAPS_API_KEY } from '../../config/constants';

// Componentes de la dirección
type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

// Formatear la dirección
export const getFormattedAddress = (addressComponents: AddressComponent[]): string => {
  const route = addressComponents.find(component => 
    component.types.includes('route'))?.long_name;
  const locality = addressComponents.find(component => 
    component.types.includes('locality'))?.long_name;
  const area = addressComponents.find(component => 
    component.types.includes('administrative_area_level_1'))?.long_name;

  return [route, locality, area].filter(Boolean).join(', ');
};

// Actualizar los tipos para que coincidan con los setState de React
type SetIsLoading = (value: boolean) => void;
type SetLocation = (value: string) => void;

export const getCurrentLocation = async (
  setIsLoading: SetIsLoading,
  setLocation: SetLocation
): Promise<void> => {
  setIsLoading(true);
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Permission to access location was denied');
      setIsLoading(false);
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    
    // Llamada a la API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const formattedAddress = getFormattedAddress(data.results[0].address_components);
      setLocation(formattedAddress || ''); // Nos aseguramos que siempre sea string
    } else {
      Alert.alert('Error', 'Could not find location name');
      setLocation(''); 
    }

  } catch (error) {
    Alert.alert('Error', 'Could not fetch location');
    console.error(error);
    setLocation('');
  } finally {
    setIsLoading(false);
  }
};