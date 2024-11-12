import React, { FC, useState } from 'react';
import { View, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { createStyles } from './styles';
import { AvatarProps } from './types';
import { AVATAR_SIZES } from './constants';

export const DEFAULT_AVATAR_URL = require('@assets/images/profilePic.png'); // Profile pic predeterminada

export const Avatar = ({
  size = 'medium',
  imageUrl,
  onPress,
  showBorder = false,
} : AvatarProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPressed, setIsPressed] = useState(false); // Nuevo estado para manejar la opacidad

  const styles = createStyles({
    size: AVATAR_SIZES[size],
    showBorder,
  });

  const content = (
    <View style={styles.container}>
      {imageUrl && !hasError ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
      ) : (
        <Image
        source={DEFAULT_AVATAR_URL } // Imagen predeterminada
        style={styles.image}
      />
      )}
      {isLoading && (
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
        onPressIn={() => setIsPressed(true)} 
        onPressOut={() => setIsPressed(false)} 
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        {content}
      </Pressable>
    );
  }

  return content;
};

export default Avatar;
