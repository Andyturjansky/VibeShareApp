import React, { useEffect, useCallback, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { ProfileHeader } from '@components/profile/profileHeader';
import { EditProfileModal } from '@components/profile/editProfileModal/editProfileModal';
import Post from '@components/post';
import { styles } from '@components/profile/styles';
import { fetchUserProfile, fetchUserPosts, toggleFollowUser, selectViewedProfile, selectCurrentProfile, selectIsLoading, selectUserPosts } from '@redux/slices/profileSlice';
import { Routes } from '@navigation/types';
import { Post as PostType } from '@components/post/types';

interface ProfileScreenProps {
  navigation: any;
  route: any;
}

export const ProfileScreen = ({ navigation, route } : ProfileScreenProps) => {
  const dispatch = useAppDispatch();
  const viewedProfile = useAppSelector(selectViewedProfile);
  const currentProfile = useAppSelector(selectCurrentProfile);
  const isLoading = useAppSelector(selectIsLoading);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const userId = route.params?.userId;
  const isOwnProfile = !userId || userId === currentProfile?.id;
  const profileToShow = isOwnProfile ? currentProfile : viewedProfile;
  const userPosts = useAppSelector(selectUserPosts);

  useEffect(() => {
    if (userId && userId !== currentProfile?.id) {
      dispatch(fetchUserProfile(userId));
    }
    if (isOwnProfile && currentProfile?.id) {
      dispatch(fetchUserPosts(currentProfile.id));
    }
  }, [userId, currentProfile?.id, dispatch, isOwnProfile]);

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
    if (userId) {
      dispatch(toggleFollowUser(userId));
    }
  }, [dispatch, userId]);

  const handleFollowersPress = useCallback(() => {
    navigation.navigate(Routes.Followers, { userId: profileToShow?.id });
  }, [navigation, profileToShow?.id]);

  const handleFollowingPress = useCallback(() => {
    navigation.navigate(Routes.Following, { userId: profileToShow?.id });
  }, [navigation, profileToShow?.id]);

  const handleLikePress = (postId: string) => {
    // Implementar lógica de like
  };

  const handleCommentPress = (postId: string) => {
    navigation.navigate(Routes.Comments, { postId });
  };

  const handleSavePress = (postId: string) => {
    // Implementar lógica de guardar post
  };

  const renderPost = useCallback(({ item }: { item: PostType }) => (
    <Post
      post={item}
      onLikePress={handleLikePress}
      onCommentPress={handleCommentPress}
      onSavePress={handleSavePress}
    />
  ), [handleLikePress, handleCommentPress, handleSavePress]);

  const renderHeader = useCallback(() => (
    profileToShow ? (
      <ProfileHeader
        profile={profileToShow}
        isOwnProfile={isOwnProfile}
        onEditProfile={handleEditProfile}
        onFollowPress={handleFollowPress}
        onFollowersPress={handleFollowersPress}
        onFollowingPress={handleFollowingPress}
        onSettingsPress={handleSettingsPress}
      />
    ) : null
  ), [profileToShow, isOwnProfile, handleEditProfile, handleFollowPress, handleFollowersPress, handleFollowingPress, handleSettingsPress]);

  return (
    <View style={styles.container}>
      <FlatList
        data={isOwnProfile ? userPosts : []}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />

      {profileToShow && (
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