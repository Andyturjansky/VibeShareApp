import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { Routes } from './types';
import { LoginScreen } from '@screens/auth/loginScreen';
import { RegisterScreen } from '@screens/auth/registerScreen';
import { ForgotPasswordScreen } from '@screens/auth/forgotPasswordScreen';
import { VerificationCodeScreen } from '@screens/auth/verificationCodeScreen';
import { ProfilePictureScreen } from '@screens/auth/profilePictureScreen';
import { WelcomeScreen } from '@screens/auth/welcomeScreen';
import { colors } from '@styles/colors';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.black,
        },
        headerTintColor: colors.text.white,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name={Routes.Login} 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name={Routes.Register} 
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name={Routes.ForgotPassword} 
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name={Routes.VerificationCode} 
        component={VerificationCodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name={Routes.ProfilePicture} 
        component={ProfilePictureScreen}
        options={{ 
          headerShown: false,
          gestureEnabled: false,
       }}
      />
      <Stack.Screen 
        name={Routes.Welcome} 
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};