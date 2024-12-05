import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { UserProfile } from './types';
import { styles } from './styles';
import Avatar from '..//avatar';
import { CoverImage } from './coverImage';

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  onEditProfile: () => void;
  onFollowPress: () => void;
  onFollowersPress: () => void;
  onFollowingPress: () => void;
  onSettingsPress: () => void;
  onAvatarPress?: () => void;
}

export const ProfileHeader = ({
  profile,
  isOwnProfile,
  onEditProfile,
  onFollowPress,
  onFollowersPress,
  onFollowingPress,
  onSettingsPress,
  onAvatarPress,
} : ProfileHeaderProps) => {
  const {
    coverPicture,
    profilePicture,
    firstName,
    lastName,
    username,
    bio,
    followersCount,
    followingCount,
    postsCount,
    commentsCount,
    isFollowing,
  } = profile;

  return (
    <View>
      <CoverImage imageUrl={coverPicture} />
      
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Avatar
            size="large"
            imageUrl={profilePicture || undefined}
            onPress={isOwnProfile ? onAvatarPress : undefined}
            showBorder={true}
          />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
          <Text style={styles.username}>@{username}</Text>
          {bio && <Text style={styles.bio}>{bio}</Text>}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{postsCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>

          {isOwnProfile ? (
            <Pressable 
              style={({pressed}) => [
                styles.statItem,
                pressed && styles.pressedState
              ]}
              onPress={onFollowingPress}
            >
              <Text style={styles.statNumber}>{followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </Pressable>
          ) : (
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          )}
          
          {isOwnProfile ? (
            <Pressable 
              style={({pressed}) => [
                styles.statItem,
                pressed && styles.pressedState
              ]}
              onPress={onFollowersPress}
            >
              <Text style={styles.statNumber}>{followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </Pressable>
          ) : (
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          )}

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{commentsCount}</Text>
            <Text style={styles.statLabel}>Comments</Text>
          </View>
        </View>

        {/* Los botones se mantienen igual ya que ya tienes la lógica condicional */}
        <View style={styles.actionButtons}>
          {isOwnProfile ? (
            <>
              <Pressable
                style={({pressed}) => [
                  styles.button,
                  styles.secondaryButton,
                  pressed && styles.buttonPressed
                ]}
                onPress={onEditProfile}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [
                  styles.button,
                  styles.secondaryButton,
                  pressed && styles.buttonPressed
                ]}
                onPress={onSettingsPress}
              >
                <Text style={styles.buttonText}>Settings</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              style={({pressed}) => [
                styles.button,
                isFollowing ? styles.secondaryButton : styles.primaryButton,
                pressed && styles.buttonPressed
              ]}
              onPress={onFollowPress}
            >
              <Text style={styles.buttonText}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};