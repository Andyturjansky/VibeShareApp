import React, { useState } from 'react';
import { View, Text, Modal, TextInput, ScrollView, Pressable } from 'react-native';
import { useAppDispatch } from '@redux/hooks';
import { updateUserProfile } from '@redux/slices/profileSlice';
import { ImageSelector } from '../imageSelector/imageSelector';
import { styles } from './styles';
import { colors } from '@styles/colors';
import { UserProfile } from '../types';
import * as ImagePicker from 'expo-image-picker';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const EditProfileModal = ({
  visible,
  onClose,
  profile,
} : EditProfileModalProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: profile.username,
    bio: profile.bio || '',
    gender: profile.gender,
    profilePicture: profile.profilePicture,
    coverPicture: profile.coverPicture,
  });

  const handleImageSelect = async (type: 'profile' | 'cover') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'profile' ? [1, 1] : [16, 9],
        quality: 0.7,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setFormData(prev => ({
          ...prev,
          [type === 'profile' ? 'profilePicture' : 'coverPicture']: imageUri,
        }));
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Pressable 
            onPress={onClose}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.pressed
            ]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <Pressable 
            onPress={handleSave}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.pressed
            ]}
          >
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.modalContent}>
          <ImageSelector
            label="Cover Photo"
            imageUrl={formData.coverPicture}
            onPress={() => handleImageSelect('cover')}
            aspectRatio={16/9}
            height={150}
          />

          <ImageSelector
            label="Profile Photo"
            imageUrl={formData.profilePicture}
            onPress={() => handleImageSelect('profile')}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
              placeholderTextColor={colors.input.placeholder}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
              placeholderTextColor={colors.input.placeholder}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
              placeholderTextColor={colors.input.placeholder}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={formData.bio}
              onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
              multiline
              numberOfLines={4}
              placeholderTextColor={colors.input.placeholder}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderButtons}>
              {['male', 'female', 'other'].map((gender) => (
                <Pressable
                  key={gender}
                  style={({ pressed }) => [
                    styles.genderButton,
                    formData.gender === gender && styles.genderButtonSelected,
                    pressed && styles.pressed
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, gender: gender as UserProfile['gender'] }))}
                >
                  <Text style={[
                    styles.genderButtonText,
                    formData.gender === gender && styles.genderButtonTextSelected
                  ]}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};