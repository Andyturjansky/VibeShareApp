import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Pressable, StyleSheet, Text } from 'react-native';
import { styles } from './styles';
import { PostImageProps } from './types';
import { POST_CONSTANTS, SKELETON_ANIMATION } from './constants';
import PostImageViewer from './postImageViewer';
import { Ionicons } from '@expo/vector-icons';

const PostImage = ({ imageUrl, postId, onLike }: PostImageProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [isImageViewerVisible, setIsImageViewerVisible] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(SKELETON_ANIMATION.MIN_OPACITY)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation;

    if (isLoading) {
      animation = Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: SKELETON_ANIMATION.MAX_OPACITY,
          duration: SKELETON_ANIMATION.DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: SKELETON_ANIMATION.MIN_OPACITY,
          duration: SKELETON_ANIMATION.DURATION,
          useNativeDriver: true,
        }),
      ]);

      Animated.loop(animation).start();
    } else {
      fadeAnim.setValue(0);
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isLoading, fadeAnim]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleExpandPress = () => {
    setIsImageViewerVisible(true);
  };

  const handleImagePress = () => {
    // Implementar funcionalidad si es necesario
  };

  return (
    <View>
      <Pressable onPress={handleImagePress}>
        <View style={styles.imageContainer}>
          {isLoading && (
            <Animated.View
              style={[
                additionalStyles.skeletonLoader,
                {
                  opacity: fadeAnim,
                },
              ]}
            />
          )}

          <Image
            source={{ uri: imageUrl }}
            style={[
              styles.image,
              { opacity: isLoading || hasError ? 0 : 1 }
            ]}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />

          {hasError && (
            <View style={additionalStyles.errorContainer}>
              <Text style={additionalStyles.errorText}>
                Unable to load post
              </Text>
            </View>
          )}

          <Pressable 
            style={additionalStyles.expandButton}
            onPress={handleExpandPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="expand-outline" size={24} color="#FFFFFF" />
          </Pressable>  
        </View>
      </Pressable>

      <PostImageViewer
        imageUrl={imageUrl}
        isVisible={isImageViewerVisible}
        onClose={() => setIsImageViewerVisible(false)}
      />
    </View>
  );
};

const additionalStyles = StyleSheet.create({
  skeletonLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E1E1E1',
    borderRadius: POST_CONSTANTS.BORDER_RADIUS,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: POST_CONSTANTS.BORDER_RADIUS,
  },
  errorText: {
    color: '#666666',
    fontSize: 14,
  },
  expandButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'B5B5B5',
    borderRadius: 8,
    padding: 8,
    zIndex: 1,
  },
});

export default React.memo(PostImage);
