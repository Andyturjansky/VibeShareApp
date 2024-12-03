import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { styles } from './styles';
import { PostDescriptionProps } from './types';

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const PostDescription = ({
  description,
  likesCount,
  onUserPress,
} : PostDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = description.length > 120;

  const toggleDescription = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const renderLikes = () => (
    <Text style={styles.likes}>
      {likesCount === 1 
        ? '1 like' 
        : `${likesCount.toLocaleString()} likes`}
    </Text>
  );

  const renderDescription = () => (
    <View style={styles.captionContainer}>
      
      {shouldTruncate && !isExpanded ? (
        <>
          <Text style={styles.captionText} numberOfLines={2}>
            {description}
          </Text>
          <Pressable onPress={toggleDescription} style={({ pressed }) => [
            pressed ? { opacity: 0.7 } : {},
          ]}>
            <Text style={additionalStyles.moreText}>more</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.captionText}>
          {description}
          {shouldTruncate && (
            <Pressable onPress={toggleDescription} style={({ pressed }) => [
              pressed ? { opacity: 0.7 } : {},
            ]}>
              <Text style={additionalStyles.lessText}> ...less</Text>
            </Pressable>
          )}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.description}>
      {likesCount > 0 && renderLikes()}
      {renderDescription()}
    </View>
  );
};

const additionalStyles = StyleSheet.create({
  moreText: {
    color: '#F0F0F0',
    fontSize: 14,
    marginTop: 2,
  },
  lessText: {
    color: '#F0F0F0',
    fontSize: 14,
  },
});

export default React.memo(PostDescription);
