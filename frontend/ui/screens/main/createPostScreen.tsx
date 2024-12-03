import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Platform, Alert, ScrollView } from 'react-native';
import { Video, ResizeMode } from 'expo-av'; 
import { Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '@styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes, RootStackParamList, PostStackParamList } from '@navigation/types';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { createPostThunk } from '@redux/thunks/postThunks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentLocation } from '@utils/locationHelper';
import { Button } from '@components/common/button';
import { selectLoading } from '@redux/slices/postsSlice';

type CreatePostRouteProp = RouteProp<PostStackParamList, Routes.CreatePost>;
type CreatePostNavigationProp = NativeStackNavigationProp<PostStackParamList & RootStackParamList>;

const CreatePostScreen = () => {
  const navigation = useNavigation<CreatePostNavigationProp>();
  const route = useRoute<CreatePostRouteProp>();
  const dispatch = useAppDispatch();
  
  const { mediaUri, mediaType } = route.params;
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const isLoading = useAppSelector(selectLoading);

  const handleGetLocation = useCallback(async () => {
    try {
      await getCurrentLocation(
        setIsLocationLoading,
        (value: string) => setLocation(value)
      );
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location');
    }
  }, []);

  const handlePost = async () => {
    try {
      console.log('Starting post creation...'); // Debug log
      console.log('Media URI:', mediaUri); // Debug log
      console.log('Media Type:', mediaType); // Debug log
      console.log('Caption:', caption); // Debug log
      console.log('Location:', location); // Debug log

      if (!caption.trim() || !location.trim()) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      console.log('Dispatching createPostThunk...'); // Debug log
      const result = await dispatch(createPostThunk({
        mediaUri,
        mediaType,
        caption: caption.trim(),
        location: location.trim(),
      })).unwrap();

      console.log('Post created successfully:', result); // Debug log

      // Si la creación fue exitosa, navegamos de vuelta al feed
      navigation.reset({
        index: 0,
        routes: [
          {
            name: Routes.MainTabs,
            params: {
              screen: Routes.Home,
              params: { scrollToTop: true }
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error creating post:', error); // Debug log
      Alert.alert(
        'Error',
        'Could not create post. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Debug render log
  console.log('Render state:', {
    isLoading,
    hasMedia: !!mediaUri,
    hasCaption: !!caption,
    hasLocation: !!location
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.white} />
        </Pressable>
        <Text style={styles.headerTitle}>New post</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.mediaPreview}>
          {mediaType === 'video' ? (
            <Video
              source={{ uri: mediaUri }}
              style={styles.previewImage}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay={false}
            />
          ) : (
            <Image source={{ uri: mediaUri }} style={styles.previewImage} />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Write a caption for your post!</Text>
          <TextInput
            style={styles.input}
            placeholder="Fun."
            placeholderTextColor={colors.input.placeholder}
            value={caption}
            onChangeText={setCaption}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Where was this photo taken?</Text>
          <TextInput
            style={styles.input}
            placeholder="Soho, New York"
            placeholderTextColor={colors.input.placeholder}
            value={location}
            onChangeText={setLocation}
            editable={!isLoading}
          />
          <Pressable 
            onPress={handleGetLocation}
            disabled={isLoading || isLocationLoading}
            style={styles.useLocationButton}
          >
            <Text style={styles.useLocationText}>
              Use current location.
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? "Creating post..." : "Post"}
          onPress={handlePost}
          variant="green"
          disabled={isLoading || !caption.trim() || !location.trim()}
        />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  mediaPreview: {
    marginBottom: 24,
    backgroundColor: '#1C1C1E', 
    borderRadius: 8,
    overflow: 'hidden', 
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    color: colors.text.white,
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    color: colors.text.white,
    fontSize: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 12,
    height: 40,
    marginBottom: 8,
  },
  useLocationButton: {
    alignSelf: 'flex-end',
  },
  useLocationText: {
    color: colors.text.green,
    fontSize: 14,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: colors.background.black,
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
  },
});

export default CreatePostScreen;