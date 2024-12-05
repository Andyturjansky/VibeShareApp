// followingScreen.tsx
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { fetchFollowing, selectFollowing } from '@redux/slices/profileSlice';
import { UserListItem } from '@components/profile/userList/userListItem';
import { colors } from '@styles/colors';
import { ProfileStackParamList, Routes } from '@navigation/types';

type FollowingScreenProps = NativeStackScreenProps<ProfileStackParamList, Routes.Following>;

export const FollowingScreen: React.FC<FollowingScreenProps> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const following = useAppSelector(selectFollowing);
  const { username } = route.params;

  useEffect(() => {
    if (username) {
      dispatch(fetchFollowing(username));
    }
  }, [username]);

  return (
    <View style={styles.container}>
      <FlatList
        data={following}
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