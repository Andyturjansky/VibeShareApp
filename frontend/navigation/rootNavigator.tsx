import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

// import routes and navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes, RootStackParamList } from './types';

// import navigation components
import { AuthStack } from './authStack';
import { MainTabNavigator } from './mainTabNavigator';
import CommentsScreen  from '@screens/modal/commentsScreen';

// import auth context
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectIsAuthenticated, selectIsLoading, initializeAuth } from '@redux/slices/authSlice';

import { colors } from '@styles/colors';


const RootStack = createNativeStackNavigator<RootStackParamList>();

// 2 Flujos. El de register/login/forgetPassword y home de la app

export const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  //const isAuthenticated = true;
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await dispatch(initializeAuth());
      setIsInitialized(true);
    };
    initAuth();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.black }}>
        <ActivityIndicator size="large" color={colors.text.white} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {!isAuthenticated ? (
          <RootStack.Screen
            name={Routes.Auth}
            component={AuthStack}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <RootStack.Screen
              name={Routes.MainTabs}
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <RootStack.Group 
              screenOptions={{ 
                presentation: 'modal',
                headerStyle: {
                  backgroundColor: colors.background.black,
                },
                headerTintColor: '#fff',
              }}
            >
              <RootStack.Screen 
                name={Routes.Comments} 
                component={CommentsScreen}
                options={{
                  title: 'Comments',
                  headerShadowVisible: false,
                }}
              />
            </RootStack.Group>
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};