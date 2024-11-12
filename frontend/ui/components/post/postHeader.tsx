import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from './styles';
import { PostHeaderProps } from './types';
import Avatar from '../avatar';
import { formatDate } from '../../utils/dateUtils';

const PostHeader = ({
  user,
  location,
  createdAt,
  onUserPress,
} : PostHeaderProps) => {
  const handleUserPress = () => {
    if (onUserPress) {
      onUserPress(user.id);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Pressable onPress={handleUserPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
          <Avatar 
            size="small" 
            imageUrl={user.profilePicture}
            onPress={handleUserPress}
          />
        </Pressable>
        
        <View style={styles.headerInfo}>
          <Pressable onPress={handleUserPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <Text style={styles.username}>{user.username}</Text>
          </Pressable>
          
          {location && (
            <Text style={styles.location} numberOfLines={1}>
              {location}
            </Text>
          )}
        </View>
      </View>

      <Text style={styles.date}>{formatDate(createdAt)}</Text>
    </View>
  );
};

export default React.memo(PostHeader);
