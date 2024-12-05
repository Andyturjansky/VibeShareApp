import React, { useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { PostActionsProps } from './types';
import { POST_CONSTANTS } from './constants';
import { Pressable } from 'react-native';

const PostActions = ({
  postId,
  isLiked,
  isSaved,
  commentsCount,
  onLikePress,
  onCommentPress,
  onSavePress,
}: PostActionsProps) => {
  const likeScale = useRef(new Animated.Value(1)).current;
  const saveScale = useRef(new Animated.Value(1)).current;

  const animateButton = (scale: Animated.Value) => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.8,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }),
    ]).start();
  };

  const handleLikePress = () => {
    animateButton(likeScale);
    onLikePress(postId);
  };

  const handleSavePress = () => {
    animateButton(saveScale);
    onSavePress(postId);
  };

  return (
    <View style={styles.actions}>
      <View style={styles.actionsLeft}>
        <Animated.View style={{ transform: [{ scale: likeScale }] }}>
          <Pressable 
            onPress={handleLikePress}
            style={({ pressed }) => [
              additionalStyles.actionButton,
              pressed ? { opacity: 0.7 } : {},
            ]}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "#FF3B30" : "#F0F0F0"}
            />
          </Pressable>
        </Animated.View>


        <View style={additionalStyles.commentContainer}>
          <Pressable 
            onPress={() => onCommentPress?.(postId)}
            style={({ pressed }) => [
              additionalStyles.actionButton,
              pressed ? { opacity: 0.7 } : {},
            ]}
          >
            <Ionicons 
              name="chatbubble-outline"
              size={24}
              color="#F0F0F0"
            />
          </Pressable>
          <Text style={additionalStyles.commentCount}>
            {commentsCount === 0 ? 'No comments yet' : `${commentsCount.toLocaleString()} comments`}
          </Text>
        </View>
      
      </View>

      <Animated.View style={{ transform: [{ scale: saveScale }] }}>
        <Pressable 
          onPress={handleSavePress}
          style={({ pressed }) => [
            additionalStyles.actionButton,
            pressed ? { opacity: 0.7 } : {},
          ]}
        >
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={24}
            color="#F0F0F0"
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const additionalStyles = StyleSheet.create({
  actionButton: {
    marginRight: 4,
    padding: 4,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    color: '#F0F0F0',
    fontSize: 14,
    marginLeft: 1,
  },
});

export default React.memo(PostActions);