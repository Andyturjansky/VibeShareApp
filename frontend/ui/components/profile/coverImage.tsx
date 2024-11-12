import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { styles } from './styles';

interface CoverImageProps {
  imageUrl: string | null;
}

export const CoverImage = ({ imageUrl } : CoverImageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <View style={styles.coverContainer}>
      {imageUrl && !hasError ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.coverImage}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
      ) : (
        <View style={styles.coverPlaceholder} />
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
};