import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@styles/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '@navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';

type PostScreenParams = {
    [Routes.SelectMedia]: undefined;
    [Routes.CreatePost]: {
      mediaUri: string;
      mediaType: 'image' | 'video';
    };
};
  
type PostNavigationProp = NativeStackNavigationProp<PostScreenParams>;

const SelectMediaScreen = () => {
  const navigation = useNavigation<PostNavigationProp>();
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'], // Actualizado según la nueva API
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        exif: true
      });

      console.log('Media picked:', result);

      if (!result.canceled) {
        const asset = result.assets[0];
        setSelectedMedia(asset.uri);
        // Determinar el tipo de medio basado en el tipo MIME
        setMediaType(asset.type === 'video' ? 'video' : 'image');
      }
    } catch (error) {
      console.error('Error picking media:', error);
      alert('Failed to select media. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setSelectedMedia(asset.uri);
        setMediaType('image'); // La cámara siempre producirá una imagen
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Failed to take photo. Please try again.');
    }
  };

  const handleNext = () => {
    if (selectedMedia) {
      navigation.navigate(Routes.CreatePost, {
        mediaUri: selectedMedia,
        mediaType: mediaType,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text.white} />
        </Pressable>
        <Text style={styles.headerTitle}>New post</Text>
        <Pressable 
          onPress={handleNext}
          disabled={!selectedMedia}
          style={({pressed}) => [
            styles.nextButton,
            {opacity: pressed ? 0.7 : 1},
            !selectedMedia && styles.nextButtonDisabled
          ]}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </View>

      <View style={styles.mediaContainer}>
        {selectedMedia ? (
          mediaType === 'video' ? (
            <Video
              source={{ uri: selectedMedia }}
              style={styles.selectedMedia}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay={false}
            />
          ) : (
            <Image source={{ uri: selectedMedia }} style={styles.selectedMedia} />
          )
        ) : (
          <Text style={styles.placeholderText}>Select an image or video</Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable 
          style={({pressed}) => [
            styles.button,
            {opacity: pressed ? 0.7 : 1}
          ]} 
          onPress={pickMedia}
        >
          <Ionicons name="images" size={24} color={colors.text.white} />
          <Text style={styles.buttonText}>Gallery</Text>
        </Pressable>
        
        <Pressable 
          style={({pressed}) => [
            styles.button,
            {opacity: pressed ? 0.7 : 1}
          ]} 
          onPress={takePhoto}
        >
          <Ionicons name="camera" size={24} color={colors.text.white} />
          <Text style={styles.buttonText}>Camera</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    padding: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: colors.text.green,
    fontSize: 16,
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMedia: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholderText: {
    color: colors.text.grey,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  button: {
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    color: colors.text.white,
    marginTop: 5,
  },
});

export default SelectMediaScreen;