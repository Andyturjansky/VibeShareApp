import { StyleSheet } from 'react-native';
import { AvatarStylesProps } from './types';
import { AVATAR_BORDER_WIDTH, AVATAR_BORDER_COLOR } from './constants';

export const createStyles = ({ size, showBorder }: AvatarStylesProps) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: 'hidden',
      borderWidth: showBorder ? AVATAR_BORDER_WIDTH : 0,
      borderColor: AVATAR_BORDER_COLOR,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholder: {
      width: '100%',
      height: '100%',
      backgroundColor: '#E1E1E1',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });