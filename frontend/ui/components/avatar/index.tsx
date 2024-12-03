import React from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { createStyles } from './styles';
import { AvatarProps } from './types';
import { AVATAR_SIZES } from './constants';

export const DEFAULT_AVATAR_URL = require('@assets/images/profilePic.png');

export const Avatar = ({
  size = 'medium',
  imageUrl,
  onPress,
  showBorder = false,
}: AvatarProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Reset error state when imageUrl changes
  React.useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  const styles = React.useMemo(
    () =>
      createStyles({
        size: AVATAR_SIZES[size],
        showBorder,
      }),
    [size, showBorder]
  );

  const content = (
    <View style={styles.container}>
      <Image
        source={imageUrl && !hasError ? { uri: imageUrl } : DEFAULT_AVATAR_URL}
        style={styles.image}
        transition={200}
        contentFit="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
      {isLoading && imageUrl && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          color="#666"
          size="small"
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

export default Avatar;