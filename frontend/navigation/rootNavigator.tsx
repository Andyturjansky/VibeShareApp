// import routes and navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes, RootStackParamList } from './types';

// import navigation components
import { AuthStack } from './authStack';
import { MainTabNavigator } from './mainTabNavigator';
import CommentsScreen  from '@screens/modal/commentsScreen';

// import auth context
import { useAuth } from '../context/auth';

import { colors } from '@styles/colors';


const RootStack = createNativeStackNavigator<RootStackParamList>();

// 2 Flujos. El de register/login/forgetPassword y home de la app

export const RootNavigator = () => {
    
  //const { isAuthenticated } = useAuth(); // Hook de autenticación
  const isAuthenticated = true;

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