import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

interface HomeTabIconProps {
  focused: boolean;
  color: string;
  size: number;
  onPress: () => void;
}

const HomeTabIcon = ({
  focused,
  color,
  size,
  onPress,
} : HomeTabIconProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <Pressable 
      onPress={handlePress} 
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })} // Manejo de opacidad
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {/* Tu ícono de home aquí */}
      </Animated.View>
    </Pressable>
  );
};

export default HomeTabIcon;
