import React from 'react';
import { Image } from 'react-native';
import { Routes, MainTabsParamList } from './types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileStack } from './profileStack';
import FeedScreen from '@screens/main/feedScreen';
import SearchScreen from '@screens/main/searchScreen';
import { PostStack } from './postStack';
import { EmptyComponent } from './temporaryScreens';
import HomeSvg from '@assets/icons/main/home.svg';
import SearchSvg from '@assets/icons/main/search.svg';
import NewPostSvg from '@assets/icons/main/newPost.svg';
import NotificationsSvg from '@assets/icons/main/notifications.svg';
import ProfileSvg from '@assets/icons/main/profile.svg';
import { colors } from '@styles/colors';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabNavigator = () => {
  const navigation = useNavigation();

  const handleTabPress = (e: any, navigation: any, route: any) => {
    const isFocused = navigation.isFocused();

    if (route.name === Routes.Home && isFocused) {
      e.preventDefault();

      const scrollToTop = navigation
        .getState()
        .routes.find((r: any) => r.name === Routes.Home)
        ?.params?.scrollToTop;

      if (scrollToTop) {
        scrollToTop();
      }
    }

    // Manejar el tab de Profile
    if (route.name === Routes.Profile && isFocused) {
      e.preventDefault();
      // Reset la navegación al perfil propio
      navigation.reset({
        index: 0,
        routes: [
          {
            name: Routes.MainTabs,
            state: {
              routes: [{ name: Routes.Profile }],
            },
          },
        ],
      });
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: '#F0F0F0',
        headerShown: false,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.background.black,
          height: 84,
          borderTopWidth: 0,
          paddingVertical: 14,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name={Routes.Home}
        component={FeedScreen}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Image 
              source={require('@assets/images/adaptive-icon.png')} 
              style={{
                width: 160,
                height: 55,
                resizeMode: 'contain',
                marginTop: -10,
              }}
            />
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            height: 85,
            backgroundColor: colors.background.black,
          },
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} stroke="none" />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => handleTabPress(e, navigation, route),
        })}
      />
      <Tab.Screen
        name={Routes.Search}
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <SearchSvg fill={color} stroke="none" />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.NewPost}
        component={PostStack}
        options={{
          tabBarIcon: () => (
            <NewPostSvg 
              style={{ 
                marginBottom: -3,
              }}
            />
          ),
          tabBarStyle: {
            display: 'none'
          }
        }}
      />
      <Tab.Screen
        name={Routes.Activity}
        component={EmptyComponent}
        options={{
          tabBarIcon: ({ color }) => (
            <NotificationsSvg fill={color} stroke="none" />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.Profile}
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} stroke="none" />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => handleTabPress(e, navigation, route),
        })}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;