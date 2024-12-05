import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { colors } from '@styles/colors';
import Avatar from '@components/avatar';
import { Routes } from '@navigation/types';

interface UserListItemProps {
  id: string;          
  profilePicture: string | null;
  username: string;
  firstName: string;
  lastName: string;
  navigation: any;
}

export const UserListItem = ({ 
  id,
  profilePicture, 
  username, 
  firstName, 
  lastName,
  navigation, 
}: UserListItemProps) => {
  const handlePress = () => {
    navigation.navigate('Profile', {
      screen: Routes.ProfileMain,
      params: { userId: id }
    });
  };

  return (
    <Pressable 
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <Avatar
        imageUrl={profilePicture || ''}
        size="medium"
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
        <Text style={styles.username}>@{username}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.black,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: colors.background.black,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
  username: {
    fontSize: 14,
    color: colors.text.grey,
    marginTop: 2,
  },
});