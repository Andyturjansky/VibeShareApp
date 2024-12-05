import React, { useEffect, useCallback, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { ProfileHeader } from '@components/profile/profileHeader';
import { EditProfileModal } from '@components/profile/editProfileModal/editProfileModal';
import Post from '@components/post';
import { styles } from '@components/profile/styles';
import { fetchUserProfile, fetchUserPosts, toggleFollowUser, selectViewedProfile, selectCurrentProfile, selectIsLoading, selectUserPosts, loadInitialProfile } from '@redux/slices/profileSlice';
import CommentsBottomSheet from '@components/comment/commentsBottom';
import { Routes } from '@navigation/types';
import { Post as PostType } from '@components/post/types';
import { toggleLikeThunk, toggleSaveThunk } from '@redux/thunks/postThunks';

interface ProfileScreenProps {
  navigation: any;
  route: any;
}

export const ProfileScreen = ({ navigation, route }: ProfileScreenProps) => {
  const dispatch = useAppDispatch();
  const viewedProfile = useAppSelector(selectViewedProfile);
  const currentProfile = useAppSelector(selectCurrentProfile);
  const isLoading = useAppSelector(selectIsLoading);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const userId = route.params?.userId;
  const isOwnProfile = !userId || userId === currentProfile?.id;
  const profileToShow = isOwnProfile ? currentProfile : viewedProfile;
  const userPosts = useAppSelector(selectUserPosts);

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentProfile) {
        console.log('No current profile, loading initial...');
        try {
          await dispatch(loadInitialProfile()).unwrap();
        } catch (error) {
          console.error('Error loading initial profile:', error);
        }
      }
    };
    
    loadProfile();
  }, []);

  useEffect(() => {
    if (userId && userId !== currentProfile?.id) {
      // Cargar perfil de otro usuario
      dispatch(fetchUserProfile(userId));
    } else if (isOwnProfile && currentProfile?.id) {
      // Cargar posts propios solo si es perfil propio
      dispatch(fetchUserPosts());
    }
  }, [userId, currentProfile?.id, isOwnProfile]);

  useEffect(() => {
  console.log('Current userPosts:', userPosts);
}, [userPosts]);

  useEffect(() => {
    console.log('Current Profile:', currentProfile);
    console.log('Viewed Profile:', viewedProfile);
    console.log('Profile to Show:', profileToShow);
  }, [currentProfile, viewedProfile, profileToShow]);

  const handleEditProfile = useCallback(() => {
    setIsEditModalVisible(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalVisible(false);
  }, []);


  const handleSettingsPress = useCallback(() => {
    navigation.navigate(Routes.Settings);
  }, [navigation]);

  const handleFollowPress = useCallback(() => {
    if (viewedProfile?.username) {
      dispatch(toggleFollowUser(viewedProfile.username));
    }
  }, [dispatch, viewedProfile?.username]);

  const handleFollowersPress = useCallback(() => {
    if (profileToShow?.username) {
      navigation.navigate(Routes.Followers, { username: profileToShow.username });
    }
  }, [navigation, profileToShow?.username]);
  
  const handleFollowingPress = useCallback(() => {
    if (profileToShow?.username) {
      navigation.navigate(Routes.Following, { username: profileToShow.username });
    }
  }, [navigation, profileToShow?.username]);

  const handleLikePress = useCallback(async (postId: string) => {
    try {
      await dispatch(toggleLikeThunk(postId)).unwrap();
      // Si quieres actualizar los posts después del like
      if (isOwnProfile && currentProfile?.id) {
        dispatch(fetchUserPosts());
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, [dispatch, isOwnProfile, currentProfile?.id]);

  const handleCommentPress = useCallback((postId: string) => {
    console.log('Selected post for comments:', userPosts.find(p => p.id === postId));
    setSelectedPostId(postId);
  }, [userPosts]);

  const handleCloseComments = useCallback(() => {
    setSelectedPostId(null);
  }, []);

  const handleSavePress = useCallback(async (postId: string) => {
    try {
      await dispatch(toggleSaveThunk(postId)).unwrap();
      // Si quieres actualizar los posts después de guardar/desguardar
      if (isOwnProfile && currentProfile?.id) {
        dispatch(fetchUserPosts());
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  }, [dispatch, isOwnProfile, currentProfile?.id]);

  const renderPost = useCallback(({ item }: { item: PostType }) => (
    <Post
      post={item}
      onLikePress={handleLikePress}
      onCommentPress={handleCommentPress}
      onSavePress={undefined}
    />
  ), [handleLikePress, handleCommentPress, handleSavePress]);

  const renderHeader = useCallback(() => (
    profileToShow ? (
      <ProfileHeader
        profile={profileToShow}
        isOwnProfile={isOwnProfile}
        onEditProfile={isOwnProfile ? handleEditProfile : () => {}}
        onFollowPress={!isOwnProfile ? handleFollowPress : () => {}}
        onFollowersPress={isOwnProfile ? handleFollowersPress : () => {}}
        onFollowingPress={isOwnProfile ? handleFollowingPress : () => {}}
        onSettingsPress={isOwnProfile ? handleSettingsPress : () => {}}
      />
    ) : null
  ), [profileToShow, isOwnProfile, handleEditProfile, handleFollowPress, 
    handleFollowersPress, handleFollowingPress, handleSettingsPress]);

  return (
    <View style={styles.container}>
      <FlatList
        data={isOwnProfile ? userPosts : []}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => {
          if (userId) {
            dispatch(fetchUserProfile(userId));
            if (isOwnProfile) {
              dispatch(fetchUserPosts());
            }
          } else if (currentProfile?.id) {
            dispatch(fetchUserProfile(currentProfile.id));
          }
        }}
      />

      <CommentsBottomSheet
        postId={selectedPostId || ''}
        isVisible={!!selectedPostId}
        onClose={handleCloseComments}
      />
      
      {isOwnProfile && profileToShow && (
        <EditProfileModal
          visible={isEditModalVisible}
          onClose={handleCloseEditModal}
          profile={profileToShow}
        />
      )}
    </View>
  );
};

export default ProfileScreen;