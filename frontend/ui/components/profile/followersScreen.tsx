import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { UserListItem } from '@components/profile/userList/userListItem';
import { styles } from './styles';
import { colors } from '@styles/colors';
import { fetchFollowers, selectFollowers, selectIsLoading, } from '@redux/slices/profileSlice';
import { Routes } from '@navigation/types';

interface FollowersScreenProps {
  navigation: any;
  route: any;
}

export const FollowersScreen = ({ 
  navigation, 
  route 
} : FollowersScreenProps) => {
  const dispatch = useAppDispatch();
  const followers = useAppSelector(selectFollowers);
  const isLoading = useAppSelector(selectIsLoading);
  const { userId } = route.params;

  useEffect(() => {
    if (userId) {
      dispatch(fetchFollowers(userId));
    }
  }, [dispatch, userId]);

  const handleUserPress = (selectedUserId: string) => {
    navigation.navigate(Routes.Profile, { userId: selectedUserId });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.text.grey} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={followers}
        renderItem={({ item }) => (
          <UserListItem 
            user={item} 
            onUserPress={handleUserPress}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};