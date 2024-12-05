import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { styles } from './styles';
import { colors } from '@styles/colors';
import { Ionicons } from '@expo/vector-icons';

interface ImageSelectorProps {
  label: string;
  imageUrl: string | null;
  onPress: () => void;
  aspectRatio?: number;
  height?: number;
}

export const ImageSelector = ({
  label,
  imageUrl,
  onPress,
  aspectRatio = 1,
  height = 120,
} : ImageSelectorProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.imageContainer,
          { height, aspectRatio },
          pressed && styles.pressed
        ]}
        onPress={onPress}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera" size={24} color={colors.text.grey} />
            <Text style={styles.placeholderText}>Select Image</Text>
          </View>
        )}
        <View style={styles.overlay}>
          <Ionicons name="pencil" size={20} color={colors.text.white} />
        </View>
      </Pressable>
    </View>
  );
};