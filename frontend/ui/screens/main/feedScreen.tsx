import React, { useCallback, useState, useRef, useEffect } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Post from '@components/post';
import { colors } from '@styles/colors';
import CommentsBottomSheet from '@components/comment/commentsBottom';
import { setPosts } from '@redux/slices/postsSlice';
import { toggleLikeThunk, toggleSaveThunk } from '@redux/thunks/postThunks';
import { RootState } from '@redux/store';
import { getFeedPosts } from '@networking/api/feed';
import { EmptyState } from '@components/common/emptyState';
import { ErrorState } from '@components/common/errorState';
import { AppDispatch } from '@redux/store';
import { getAds } from '@networking/api/ads';
import AdComponent from '@components/ad';
import { setAds, Ad } from '@redux/slices/adsSlice';

interface FeedScreenProps {
  navigation: any;
  onScrollPositionChange?: (position: number) => void;
}

const FeedScreen = ({ navigation, onScrollPositionChange }: FeedScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
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
  const [scrollingToTop, setScrollingToTop] = useState(false);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const ads = useSelector((state: RootState) => state.ads.ads);

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
      setError('No se pudieron cargar los posts.');
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

  const loadAds = async () => {
    try {
      const response = await getAds();
      if (Array.isArray(response) && response.length > 0) {
        const validAds = response.filter(ad => ad?.commerce); // Solo ads válidos
        dispatch(setAds(validAds));
      }
    } catch (error) {
      console.error('Error loading ads:', error);
    }
  };

  const getMixedContent = useCallback(() => {
    if (!Array.isArray(posts)) return [];
    if (!Array.isArray(ads) || ads.length === 0) {
      return posts.map(post => ({ type: 'post', data: post }));
    }
  
    const mixed = [];
    let adIndex = 0;
  
    for (let i = 0; i < posts.length; i++) {
      if (posts[i]) {
        mixed.push({ type: 'post', data: posts[i] });
        
        // Después de cada 3 posts, insertar una propaganda
        if ((i + 1) % 3 === 0 && adIndex < ads.length) {
          const ad = ads[adIndex];
          if (ad?.commerce) { // Validación adicional
            mixed.push({ type: 'ad', data: ad });
            adIndex++;
          }
        }
      }
    }
  
    return mixed;
  }, [posts, ads]);

  useEffect(() => {
    initializeFeed();
    loadAds();
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
      // Guardamos la posición actual antes de ir arriba
      if (!isAtTop) {
        setLastPosition(currentScrollPosition);
      }
      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: true
      });
      setIsAtTop(true);
      setScrollingToTop(true);
    }
  }, [isAtTop, lastPosition, currentScrollPosition]);

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
    
    // Actualizamos la posición actual del scroll
    setCurrentScrollPosition(currentOffset);
    
    // Solo actualizamos isAtTop
    setIsAtTop(currentOffset === 0);
    
    // Si llegamos a la parte superior después de un scrollToTop programático,
    // reseteamos el flag
    if (currentOffset === 0 && scrollingToTop) {
      setScrollingToTop(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setCurrentPage(0);
    try {
      await Promise.all([
        loadPosts(0, true),
        loadAds()
      ]);
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

const handleLikePress = useCallback(async (postId: string) => {
  try {
    await dispatch(toggleLikeThunk(postId)).unwrap();
  } catch (error) {
    console.error('Error toggling like:', error);
  }
}, [dispatch]);

const handleSavePress = useCallback(async (postId: string) => {
  try {
    await dispatch(toggleSaveThunk(postId)).unwrap();
  } catch (error) {
    console.error('Error toggling save:', error);
  }
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

  const renderItem = useCallback(({ item }: { item: any }) => {
    if (!item?.data) return null;
  
    if (item.type === 'ad' && item.data?.commerce) {
      return <AdComponent ad={item.data} />;
    }
  
    if (item.type === 'post' && item.data?.id) {
      return (
        <Post
          post={item.data}
          onLikePress={handleLikePress}
          onCommentPress={handleCommentPress}
          onSavePress={handleSavePress}
          onUserPress={handleUserPress}
        />
      );
    }
  
    return null;
  }, [handleLikePress, handleCommentPress, handleSavePress, handleUserPress]);

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

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={getMixedContent() || []}
        renderItem={renderItem}
        keyExtractor={item => {
          if (!item?.data) return `empty-${Math.random()}`;
          return item.type === 'post' ? 
            `post-${item.data.id || Math.random()}` : 
            `ad-${item.data.commerce || Math.random()}`;
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        onScroll={handleScroll}
        ListEmptyComponent={
          !isLoading ? <EmptyState message="There are no posts to show." /> : null
        }
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
          flexGrow: 1
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