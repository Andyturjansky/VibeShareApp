// followersScreen.tsx
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { fetchFollowers, selectFollowers } from '@redux/slices/profileSlice';
import { UserListItem } from '@components/profile/userList/userListItem';
import { colors } from '@styles/colors';
import { ProfileStackParamList, Routes } from '@navigation/types';

type FollowersScreenProps = NativeStackScreenProps<ProfileStackParamList, Routes.Followers>;

export const FollowersScreen: React.FC<FollowersScreenProps> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const followers = useAppSelector(selectFollowers);
  const { username } = route.params;

  useEffect(() => {
    if (username) {
      dispatch(fetchFollowers(username));
    }
  }, [username]);

  return (
    <View style={styles.container}>
      <FlatList
        data={followers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <UserListItem
            id={item.id}
            profilePicture={item.profilePicture}
            username={item.username}
            firstName={item.firstName}
            lastName={item.lastName}
            navigation={navigation}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.black,
  },
});