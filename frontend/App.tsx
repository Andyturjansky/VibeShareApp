import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { ThemeProvider } from './context/theme';
import { AuthProvider } from './context/auth';
import { store } from './redux/store';
// Import fonts
import { loadFonts } from './assets/fonts/fonts';
// Import strings
import I18n from './assets/strings/I18n';
// Import images
import IMAGES from './assets/images/images';
// import root navigator
import { RootNavigator } from './navigation/rootNavigator';
// Mantener el splash screen visible mientras inicializamos
SplashScreen.preventAutoHideAsync();

import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        // Cargar fuentes, recursos iniciales, etc.
        await Promise.all([
          loadFonts(),
        ]);
      } catch (e) {
        console.warn('Error loading app resources:', e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Provider store={store}>
          <AuthProvider>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </AuthProvider>
      </Provider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
