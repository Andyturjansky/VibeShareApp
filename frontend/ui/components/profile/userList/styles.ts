import { StyleSheet } from 'react-native';
import { colors } from '@styles/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background.black,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  pressed: {
    opacity: 0.7,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
  },
  username: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  name: {
    color: colors.text.grey,
    fontSize: 14,
    marginTop: 2,
  },
});