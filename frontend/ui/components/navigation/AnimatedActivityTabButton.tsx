import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export const AnimatedActivityTabButton = (props: BottomTabBarButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePress = () => {
    scale.value = withSpring(0.8, {}, () => {
      scale.value = withSpring(1);
    });
    handleActivityPress();
  };

  return (
    <Animated.View style={[props.style, animatedStyle]}>
      <TouchableOpacity
        {...props}
        onPress={handlePress}
        style={styles.tabButton}
      >
        <Heart 
          size={24} 
          color={props.accessibilityState?.selected ? '#000' : '#999'} 
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Manejador del press separado
export const handleActivityPress = () => {
  Toast.show({
    type: 'info',
    text1: 'Soon',
    text2: 'This feature will be available soon',
    position: 'bottom',
    visibilityTime: 2000,
  });
};

export const animatedActivityTabOptions = {
  tabBarIcon: ({ color, size }: { color: string, size: number }) => (
    <Heart size={size} color={color} />
  ),
  tabBarButton: (props: BottomTabBarButtonProps) => (
    <AnimatedActivityTabButton {...props} />
  ),
};

const styles = {
  tabButton: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  }
};