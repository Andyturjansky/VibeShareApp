import React, { useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { PostActionsProps } from './types';
import { POST_CONSTANTS } from './constants';
import { Pressable } from 'react-native';

const PostActions = ({
  postId,
  isLiked,
  isSaved,
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
    marginRight: POST_CONSTANTS.SPACING * 2,
    padding: 4,
  },
});

export default React.memo(PostActions);