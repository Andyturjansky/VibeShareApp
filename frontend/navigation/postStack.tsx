// navigation/postStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from './types';

// Screens
import SelectMediaScreen from '@screens/main/selectMediaScreen';
import CreatePostScreen from '@screens/main/createPostScreen';

const Stack = createNativeStackNavigator();

export const PostStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen 
        name={Routes.SelectMedia} 
        component={SelectMediaScreen} 
      />
      <Stack.Screen 
        name={Routes.CreatePost} 
        component={CreatePostScreen}
      />
    </Stack.Navigator>
  );
};