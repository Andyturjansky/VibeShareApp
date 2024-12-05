import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const POST_CONSTANTS = (() => {
  const IMAGE_WIDTH = width * 0.95; 
  return {
    IMAGE_ASPECT_RATIO: 1.7778, 
    IMAGE_WIDTH: IMAGE_WIDTH,
    IMAGE_HEIGHT: IMAGE_WIDTH * 0.70, 
    BORDER_RADIUS: 8,
    PADDING: 12,
    SPACING: 8,
    ANIMATION_DURATION: 200,
    DOUBLE_TAP_DELAY: 300,
  };
})();

export const SKELETON_ANIMATION = {
  DURATION: 1500,
  MIN_OPACITY: 0.3,
  MAX_OPACITY: 0.7,
};