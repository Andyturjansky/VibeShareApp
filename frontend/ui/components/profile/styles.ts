import { StyleSheet } from 'react-native';
import { colors } from '@styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.black,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
coverContainer: {
    width: '100%',
    height: 150,
    backgroundColor: colors.input.background, 
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.input.background,
  },
  profileSection: {
    paddingHorizontal: 16,
    marginTop: -40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.background.black,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: colors.text.grey,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: colors.text.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.grey,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.green,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.text.grey,
  },
  buttonText: {
    color: colors.text.white,
    fontWeight: '600',
  },
  pressedState: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});