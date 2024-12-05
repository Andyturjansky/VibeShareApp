import { StyleSheet } from 'react-native';
import { colors } from '@styles/colors';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: colors.text.grey,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: colors.input.background,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.text.grey,
    marginTop: 8,
  },
  overlay: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});