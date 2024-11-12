// components/comment/index.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CommentProps } from './types';
import { colors } from '@styles/colors';

const Comment = ({ comment, onUserPress }: CommentProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.commentContent}>
        <Pressable 
          onPress={() => onUserPress?.(comment.user.id)}
          style={styles.usernameContainer}
        >
          <Text style={styles.username}>{comment.user.username}</Text>
        </Pressable>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
      <Text style={styles.timestamp}>
        {new Date(comment.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  commentContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  usernameContainer: {
    marginRight: 8,
  },
  username: {
    color: colors.text.white,
    fontWeight: 'bold',
  },
  text: {
    color: colors.text.white,
    flex: 1,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  }
});

export default React.memo(Comment);