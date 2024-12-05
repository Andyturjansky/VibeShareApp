import * as Font from 'expo-font';

export const loadFonts = async (): Promise<void> => {
  await Font.loadAsync({
    'Poppins-Regular': require('./Poppins/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./Poppins/Poppins-SemiBold.ttf'),});
};