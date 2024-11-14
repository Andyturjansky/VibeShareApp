import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/types';
import { Routes } from '@navigation/types';
import { Button } from '@components/common/button';
import { Avatar } from '@components/avatar';
import { colors } from '@styles/colors';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch } from '@redux/hooks';
import { setTempProfilePicture, completeRegistration } from '@redux/slices/authSlice';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const ProfilePictureScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setImage(imageUri);
        dispatch(setTempProfilePicture(imageUri));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error selecting image. Please try again.');
    }
  };

  const handleNext = async () => {
    try {
      setIsLoading(true);
      await dispatch(completeRegistration()).unwrap();
      navigation.reset({
        index: 0,
        routes: [{ name: Routes.Welcome }]
      });
    } catch (error) {
      console.error('Error completing registration:', error);
      alert('Error completing registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add a profile picture</Text>
        <Text style={styles.subtitle}>
          Add a profile picture so that your friends know it's you. Everyone will be able to see your picture.
        </Text>

        <View style={styles.avatarContainer}>
          <Avatar
            size="xlarge"
            imageUrl={image || undefined}
            onPress={pickImage}
            showBorder={false}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <Button 
            title="Add picture" 
            onPress={pickImage}
            variant="green"
            disabled={isLoading}
          />
          <View style={styles.buttonSpacing}>
            <Button 
              title={isLoading ? "Creating account..." : "Continue"}
              onPress={handleNext}
              variant="black" 
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.black,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: colors.text.white,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: '15%',
  },
  subtitle: {
    color: colors.text.grey,
    textAlign: 'center',
    fontSize: 16,
    width: '85%',
  },
  avatarContainer: {
    marginTop: 110,
    marginBottom: 40,
  },
  buttonsContainer: {
    width: '100%',
  },
  buttonSpacing: {
    marginTop: -14, 
  },
});

export default ProfilePictureScreen;