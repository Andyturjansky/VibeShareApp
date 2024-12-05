import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes, ProfileStackParamList } from './types';
import { ProfileScreen } from '@screens/main/profileScreen';
import { FollowersScreen } from '@components/profile/followersScreen';
import { FollowingScreen } from '@components/profile/followingScreen';
import { SettingsScreen } from '@components/profile/settingsScreen'; // La crearemos después
import { colors } from '@styles/colors';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.black,
        },
        headerTintColor: colors.text.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitleVisible: false,
        headerShown: true 
      }}
    >
      <Stack.Screen 
        name={Routes.ProfileMain} 
        component={ProfileScreen}
        options={{ 
          headerShadowVisible: false,
          headerShown: false
        }} 
      />
      <Stack.Screen
        name={Routes.Followers}
        component={FollowersScreen}
        options={{ title: 'Followers' }}
      />
      <Stack.Screen
        name={Routes.Following}
        component={FollowingScreen}
        options={{ title: 'Following' }}
      />
      <Stack.Screen
        name={Routes.Settings}
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};
