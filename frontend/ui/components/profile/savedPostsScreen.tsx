import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '@styles/colors';
import Post from '@components/post';
import { Post as PostType } from '@components/post/types';
import { EmptyState } from '@components/common/emptyState';
import { ErrorState } from '@components/common/errorState';
import { selectUser } from '@redux/slices/authSlice';
import { getUserFavorites } from '@networking/api/posts';
import { toggleLikeThunk, toggleSaveThunk } from '@redux/thunks/postThunks';
import { selectUserPosts } from '@redux/slices/profileSlice';
import CommentsBottomSheet from '@components/comment/commentsBottom';
import { useAppDispatch, useAppSelector } from '@redux/hooks';

export const SavedPostsScreen = () => {
  const dispatch = useAppDispatch();
  const [savedPosts, setSavedPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useSelector(selectUser);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const userPosts = useAppSelector(selectUserPosts);


  const handleLikePress = useCallback(async (postId: string) => {
    try {
      await dispatch(toggleLikeThunk(postId)).unwrap();
      // Actualizar el estado local para reflejar el cambio del like
      setSavedPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, [dispatch]);

  const handleSavePress = useCallback(async (postId: string) => {
    try {
      await dispatch(toggleSaveThunk(postId)).unwrap();
      // Después de desguardar, recargar los posts
      await loadSavedPosts();
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  }, [dispatch]);

  const handleCommentPress = useCallback((postId: string) => {
    console.log('Selected post for comments:', userPosts.find(p => p.id === postId));
    setSelectedPostId(postId);
  }, [userPosts]);

  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    if (!currentUser?.username) return;

    try {
      setIsLoading(true);
      setError(null);
      const posts = await getUserFavorites(currentUser.username);
      setSavedPosts(posts);
    } catch (error) {
      console.error('Error loading saved posts:', error);
      setError('Could not load saved posts');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.text.white} />
      </View>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadSavedPosts} />;
  }

  if (savedPosts.length === 0) {
    return <EmptyState message="No saved posts yet" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedPosts}
        renderItem={({ item }) => (
          <Post
            post={item}
            onLikePress={handleLikePress}
            onCommentPress={handleCommentPress}
            onSavePress={handleSavePress}
          />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={loadSavedPosts}
        refreshing={isLoading}
      />

      <CommentsBottomSheet
        postId={selectedPostId || ''}
        isVisible={!!selectedPostId}
        onClose={() => setSelectedPostId(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.black,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.black,
  },
});

export default SavedPostsScreen;