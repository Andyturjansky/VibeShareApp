import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  Text, 
  Pressable, 
  PanResponder, 
  Animated, 
  Dimensions, 
  Platform, 
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectPostById } from '@redux/slices/postsSlice';
import { RootState } from '@redux/store';
import { colors } from '@styles/colors';
import CommentList from './commentList';
import CommentInput from './commentInput';
import { createCommentThunk } from '@redux/thunks/commentThunks';
import { useAppDispatch } from '@redux/hooks';

interface CommentsBottomSheetProps {
  postId: string;
  isVisible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 50;

const CommentsBottomSheet = ({ postId, isVisible, onClose }: CommentsBottomSheetProps) => {
  const dispatch = useAppDispatch();
  const [panY] = useState(new Animated.Value(0));
  const [lastGestureDistance, setLastGestureDistance] = useState(0);
  console.log('CommentsBottomSheet received postId:', postId);
  const post = useSelector((state: RootState) => 
    selectPostById(state, postId) || // Busca en posts slice
    state.profile.userPosts.find(p => p.id === postId) // Busca en profile slice
  );
  console.log('Post from selector:', post);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (text: string) => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to comment');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await dispatch(createCommentThunk({
        postId,
        text
      })).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: SCREEN_HEIGHT,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.dy > 0) {
        panY.setValue(gestureState.dy);
        setLastGestureDistance(gestureState.dy);
      }
    },
    onPanResponderRelease: () => {
      if (lastGestureDistance > SWIPE_THRESHOLD) {
        closeAnim.start(onClose);
      } else {
        resetPositionAnim.start();
      }
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Pressable 
          style={styles.backdrop} 
          onPress={onClose}
        >
          <Animated.View 
            style={[
              styles.contentContainer,
              {
                transform: [{
                  translateY: panY,
                }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={styles.title}>Comments</Text>
              <Text style={styles.commentCount}>
                {post?.commentsCount || 0} comments
              </Text>
            </View>
            <CommentList 
              comments={post?.comments || []}
              onUserPress={() => {}}
            />
            <CommentInput
              postId={postId}
              onCommentSubmit={handleCommentSubmit}
              isLoading={isSubmitting}
            />
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    height: SCREEN_HEIGHT * 0.7,
    backgroundColor: colors.background.black,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentCount: {
    color: '#666',
    fontSize: 14,
  }
});

export default CommentsBottomSheet;