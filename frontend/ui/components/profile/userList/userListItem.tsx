import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from './styles';
import Avatar from '../../avatar';
import { UserListItem as UserListItemType } from '../types';

interface UserListItemProps {
  user: UserListItemType;
  onUserPress: (userId: string) => void;
}

export const UserListItem = ({ user, onUserPress } : UserListItemProps) => {
  const { id, username, profilePicture, firstName, lastName } = user;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={() => onUserPress(id)}
    >
      <View style={styles.userInfo}>
        <Avatar
          size="small"
          imageUrl={profilePicture}
          showBorder={false}
        />
        <View style={styles.textContainer}>
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
        </View>
      </View>
    </Pressable>
  );
};