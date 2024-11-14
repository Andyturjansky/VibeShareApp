import React, { useCallback, useState, useRef, useEffect } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Post from '@components/post';
import { Post as PostType } from '@components/post/types';
import { colors } from '@styles/colors';
import CommentsBottomSheet from '@components/comment/commentsBottom';
import { setPosts, toggleLike, toggleSave } from '@redux/slices/postsSlice';
import { RootState } from '@redux/store';
import { getFeedPosts } from '@networking/api/feed';
import { EmptyState } from '@components/common/emptyState';
import { ErrorState } from '@components/common/errorState';

interface FeedScreenProps {
  navigation: any;
  onScrollPositionChange?: (position: number) => void;
}

const FeedScreen = ({ navigation, onScrollPositionChange }: FeedScreenProps) => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);
  
  const flatListRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [lastPosition, setLastPosition] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  const loadPosts = async (page: number = 0, refresh: boolean = false) => {
    try {
      setError(null);
      const response = await getFeedPosts(page);
      
      if (refresh) {
        dispatch(setPosts(response.posts));
      } else {
        // Concatenamos los nuevos posts manteniendo el orden
        const updatedPosts = [...posts, ...response.posts];
        // Eliminamos duplicados si los hubiera (por id)
        const uniquePosts = Array.from(new Map(updatedPosts.map(post => [post.id, post])).values());
        // Ordenamos para asegurar que los más recientes estén primero
        const sortedPosts = uniquePosts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        dispatch(setPosts(sortedPosts));
      }
      
      setHasMore(response.hasMore);
    } catch (error) {
      setError('No se pudieron cargar los posts. Por favor, intenta nuevamente.');
      console.error('Error loading posts:', error);
    }
   };

  const initializeFeed = async () => {
    setIsLoading(true);
    try {
      await loadPosts(0, true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeFeed();
  }, []);

  useScrollToTop(flatListRef);

  const handleTabPress = useCallback(() => {
    if (isAtTop && lastPosition > 0) {
      flatListRef.current?.scrollToOffset({
        offset: lastPosition,
        animated: true
      });
      setIsAtTop(false);
    } else {
      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: true
      });
      setIsAtTop(true);
    }
  }, [isAtTop, lastPosition]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e: any) => {
      if (navigation.isFocused()) {
        e.preventDefault();
        handleTabPress();
      }
    });
    return unsubscribe;
  }, [navigation, handleTabPress]);

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    onScrollPositionChange?.(currentOffset);
    setIsAtTop(currentOffset === 0);
    if (currentOffset > 0) {
      setLastPosition(currentOffset);
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setCurrentPage(0);
    try {
      await loadPosts(0, true);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

const handleLoadMore = useCallback(async () => {
 if (isLoadingMore || !hasMore) return;

 setIsLoadingMore(true);
 try {
   const nextPage = currentPage + 1;
   await loadPosts(nextPage);
   setCurrentPage(nextPage);
 } catch (error) {
   console.error('Error loading more posts:', error);
 } finally {
   setIsLoadingMore(false);
 }
}, [isLoadingMore, hasMore, currentPage, posts]);

  const handleLikePress = useCallback((postId: string) => {
    dispatch(toggleLike(postId));
  }, [dispatch]);

  const handleSavePress = useCallback((postId: string) => {
    dispatch(toggleSave(postId));
  }, [dispatch]);

  const handleCommentPress = useCallback((postId: string) => {
    setSelectedPostId(postId);
  }, []);

  const handleCloseComments = useCallback(() => {
    setSelectedPostId(null);
  }, []);

  const handleUserPress = useCallback((userId: string) => {
    navigation.navigate('Profile', { userId });
  }, [navigation]);

  const renderPost = useCallback(({ item }: { item: PostType }) => (
    <Post
      post={item}
      onLikePress={handleLikePress}
      onCommentPress={handleCommentPress}
      onSavePress={handleSavePress}
      onUserPress={handleUserPress}
    />
  ), [handleLikePress, handleCommentPress, handleSavePress, handleUserPress]);

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#999999" />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.text.white} />
      </View>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={initializeFeed} />;
  }

  if (!isLoading && posts.length === 0) {
    return <EmptyState message="No hay posts para mostrar" />;
  }

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh}
            tintColor={colors.text.white}
            colors={[colors.text.white]}
            progressBackgroundColor={colors.background.black}
          />
        }
        contentContainerStyle={{ 
          backgroundColor: colors.background.black,
          flexGrow: 1 // Asegura que EmptyState se centre cuando no hay posts
        }} 
        style={{ backgroundColor: colors.background.black }}
      />
      <CommentsBottomSheet
        postId={selectedPostId || ''}
        isVisible={!!selectedPostId}
        onClose={handleCloseComments}
      />
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.black,
  }
});

export default FeedScreen;