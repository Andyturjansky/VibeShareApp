// screens/main/feedScreenTest.tsx
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

interface FeedScreenProps {
  navigation: any;
  onScrollPositionChange?: (position: number) => void;
}

const FeedScreen = ({ navigation, onScrollPositionChange }: FeedScreenProps) => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);
  
  const flatListRef = useRef<FlatList>(null);
  const [lastPosition, setLastPosition] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Referencias para el manejo de taps múltiples
  const lastTapTimeRef = useRef<number>(0);
  const tapCountRef = useRef<number>(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout>();

  // Implementación de useScrollToTop
  useScrollToTop(flatListRef);

  // Datos de prueba
  useEffect(() => {
    const mockPosts: PostType[] = [
      {
        id: '1',
        user: {
          id: 'user1',
          username: 'john_doe',
          profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        imageUrl: 'https://picsum.photos/500/500',
        location: 'New York, NY',
        description: 'Beautiful day! 🌞 #sunshine #happiness',
        likesCount: 142,
        commentsCount: 3,
        isLiked: false,
        isSaved: false,
        createdAt: '2024-10-01',
        comments: [
          {
            id: 'comment1',
            user: {
              id: 'user2',
              username: 'jane_smith',
              profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg'
            },
            text: 'Amazing view! 😍',
            createdAt: '2024-10-01T12:00:00Z'
          },
          {
            id: 'comment2',
            user: {
              id: 'user3',
              username: 'mike_wilson',
              profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg'
            },
            text: 'Where exactly is this? I need to visit! 🌆',
            createdAt: '2024-10-01T12:30:00Z'
          },
          {
            id: 'comment3',
            user: {
              id: 'user4',
              username: 'emily_brown',
              profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            text: 'The lighting in this photo is perfect ✨',
            createdAt: '2024-10-01T13:00:00Z'
          }
        ],
        mediaType: 'image'
      },
      {
        id: '2',
        user: {
          id: 'user2',
          username: 'jane_smith',
          profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg'
        },
        imageUrl: 'https://picsum.photos/501/501',
        location: 'San Francisco, CA',
        description: 'Adventure time! 🌄 #explore #nature',
        likesCount: 89,
        commentsCount: 4,
        isLiked: true,
        isSaved: true,
        createdAt: '2023-08-03',
        comments: [
          {
            id: 'comment4',
            user: {
              id: 'user5',
              username: 'alex_turner',
              profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg'
            },
            text: 'This looks incredible! Which trail is this? 🏃‍♂️',
            createdAt: '2023-08-03T14:00:00Z'
          },
          {
            id: 'comment5',
            user: {
              id: 'user6',
              username: 'sarah_parker',
              profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg'
            },
            text: 'The colors are so vibrant! What camera did you use? 📸',
            createdAt: '2023-08-03T14:30:00Z'
          }
        ],
        mediaType: 'image'
      },
      {
        id: '3',
        user: {
          id: 'user3',
          username: 'emily_rose',
          profilePicture: ''
        },
        imageUrl: 'https://picsum.photos/505/505',
        location: 'Los Angeles, CA',
        description: 'City lights ✨ #nightlife #cityscape',
        likesCount: 278,
        commentsCount: 2,
        isLiked: false,
        isSaved: true,
        createdAt: '4 days ago',
        comments: [
          {
            id: 'comment8',
            user: {
              id: 'user9',
              username: 'tom_black',
              profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg'
            },
            text: 'LA nights are the best! 🌃',
            createdAt: '2024-10-02T16:00:00Z'
          },
          {
            id: 'comment9',
            user: {
              id: 'user10',
              username: 'kate_green',
              profilePicture: 'https://randomuser.me/api/portraits/women/5.jpg'
            },
            text: 'Miss this city so much! When was this taken? 🌙',
            createdAt: '2024-10-02T16:30:00Z'
          }
        ],
        mediaType: 'image'
      }
    ];

    dispatch(setPosts(mockPosts));
  }, [dispatch]);

  const resetTapCount = () => {
    tapCountRef.current = 0;
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
  };

  const handleTabPress = useCallback(() => {
    const now = Date.now();
    const TRIPLE_TAP_DELAY = 500; // 500ms para detectar triple tap
    
    tapCountRef.current += 1;
    
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    tapTimeoutRef.current = setTimeout(resetTapCount, TRIPLE_TAP_DELAY);

    if (tapCountRef.current === 3) {
      handleRefresh();
      resetTapCount();
      return;
    }

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

    lastTapTimeRef.current = now;
  }, [isAtTop, lastPosition]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e: any) => {
      if (navigation.isFocused()) {
        e.preventDefault();
        handleTabPress();
      } else {
        resetTapCount();
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
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Error refreshing feed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  const handleLikePress = useCallback((postId: string) => {
    dispatch(toggleLike(postId));
  }, [dispatch]);

  const handleSavePress = useCallback((postId: string) => {
    dispatch(toggleSave(postId));
  }, [dispatch]);

  const handleCommentPress = useCallback((postId: string) => {
    console.log('Opening comments for post:', postId);
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
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ backgroundColor: colors.background.black }} 
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