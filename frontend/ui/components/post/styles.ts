import { StyleSheet } from 'react-native';
import { POST_CONSTANTS } from './constants';
import { colors } from '@styles/colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.background.black,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: POST_CONSTANTS.PADDING,
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerInfo: {
    marginLeft: POST_CONSTANTS.SPACING,
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.white,
  },
  location: {
    fontSize: 12,
    color: colors.text.white,
    marginTop: 2,
  },
  imageContainer: {
    width: POST_CONSTANTS.IMAGE_WIDTH,
    height: POST_CONSTANTS.IMAGE_HEIGHT,
    backgroundColor: colors.background.black,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: POST_CONSTANTS.BORDER_RADIUS,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: POST_CONSTANTS.PADDING,
    justifyContent: 'space-between',
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: POST_CONSTANTS.SPACING * 2,
  },
  description: {
    paddingHorizontal: POST_CONSTANTS.PADDING,
    paddingBottom: POST_CONSTANTS.PADDING,
  },
  likes: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.white,
    marginBottom: 4,
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  captionUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.white,
    marginRight: 4,
  },
  captionText: {
    fontSize: 14,
    color: colors.text.white,
    flex: 1,
  },
  comments: {
    fontSize: 14,
    color: colors.text.white,
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: colors.text.white,
    marginTop: 4,
  },
});