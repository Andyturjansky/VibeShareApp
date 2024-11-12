import React, { useCallback, useState, useRef } from 'react';
import { Text, FlatList, RefreshControl, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import Post from '@components/post';
import { Post as PostType } from '@components/post/types';

interface FeedScreenProps {
  navigation: any;
  onScrollPositionChange?: (position: number) => void;
}

const FeedScreen = ({ navigation, onScrollPositionChange }: FeedScreenProps) => {
  const flatListRef = useRef<FlatList>(null);
  const [lastPosition, setLastPosition] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  
  // Referencias para el manejo de taps múltiples
  const lastTapTimeRef = useRef<number>(0);
  const tapCountRef = useRef<number>(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout>();

  useScrollToTop(flatListRef);

  const resetTapCount = () => {
    tapCountRef.current = 0;
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
  };

  const handleTabPress = useCallback(() => {
    const now = Date.now();
    const TRIPLE_TAP_DELAY = 500; // 500ms para detectar triple tap
    
    // Incrementar el contador de taps
    tapCountRef.current += 1;
    
    // Resetear el contador después de TRIPLE_TAP_DELAY ms
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    tapTimeoutRef.current = setTimeout(resetTapCount, TRIPLE_TAP_DELAY);

    // Si es un triple tap, realizar refresh
    if (tapCountRef.current === 3) {
      handleRefresh();
      resetTapCount();
      return;
    }

    // Si es un tap simple o doble, manejar el scroll
    if (isAtTop && lastPosition > 0) {
      // Si estamos en el top y hay una posición guardada, volver a ella
      flatListRef.current?.scrollToOffset({
        offset: lastPosition,
        animated: true
      });
      setIsAtTop(false);
    } else {
      // Si no estamos en el top o no hay posición guardada, ir arriba
      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: true
      });
      setIsAtTop(true);
    }

    lastTapTimeRef.current = now;
  }, [isAtTop, lastPosition]);

  // Registrar el handler para el tab press
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e: any) => {
      if (navigation.isFocused()) {
        e.preventDefault();
        handleTabPress();
      } else {
        resetTapCount(); // Resetear contador si cambiamos de tab
      }
    });

    return () => {
      unsubscribe();
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
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
    try {
      // Lógica para recargar posts
      // await fetchPosts();
    } catch (error) {
      console.error('Error refreshing feed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Resto del código igual...
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      // Lógica para cargar más posts
      // await fetchMorePosts();
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  const handleLikePress = useCallback((postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
            }
          : post
      )
    );
  }, []);

  const handleSavePress = useCallback((postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
  }, []);

  const handleCommentPress = useCallback((postId: string) => {
    navigation.navigate('Comments', { postId });
  }, [navigation]);

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

  return (
    <FlatList
      ref={flatListRef}
      data={posts}
      renderItem={renderPost}
      keyExtractor={item => item.id}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor="#999999"
        />
      }
      showsVerticalScrollIndicator={false}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={true}
      initialNumToRender={5}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts yet</Text>
        </View>
      )}
      contentContainerStyle={
        posts.length === 0 ? styles.emptyList : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  emptyList: {
    flex: 1,
  },
});

export default FeedScreen;