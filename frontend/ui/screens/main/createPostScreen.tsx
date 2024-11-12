import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Platform, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '@styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes, RootStackParamList, PostStackParamList } from '@navigation/types';
import { useAppDispatch } from '@redux/hooks';
import { createPost } from '@redux/slices/postsSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentLocation } from '@utils/locationHelper';
import { Button } from '@components/common/button';

type CreatePostRouteProp = RouteProp<PostStackParamList, Routes.CreatePost>;
type CreatePostNavigationProp = NativeStackNavigationProp<PostStackParamList & RootStackParamList>;

const CreatePostScreen = () => {
  const navigation = useNavigation<CreatePostNavigationProp>();
  const route = useRoute<CreatePostRouteProp>();
  const dispatch = useAppDispatch();
  
  const { mediaUri, mediaType } = route.params;
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetLocation = useCallback(async () => {
    try {
      await getCurrentLocation(
        setIsLoading,
        (value: string) => setLocation(value)
      );
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location');
    }
  }, []);

  const handlePost = async () => {
    try {
      if (!caption.trim() || !location.trim()) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      await dispatch(createPost({
        id: Date.now().toString(),
        user: {
          id: 'currentUserId',
          username: 'currentUsername', 
          profilePicture: 'https://i.pravatar.cc/150?img=10' 
        },
        imageUrl: mediaUri,
        location: location.trim(),
        description: caption.trim(),
        likesCount: 0,
        isLiked: false,
        isSaved: false,
        createdAt: new Date().toISOString(),
        commentsCount: 0,
        comments: [], 
        mediaType: mediaType as 'image' | 'video'
      }));

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
      Alert.alert('Error', 'Could not create post. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header fijo arriba */}
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
  
      {/* Contenido principal con scroll */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.mediaPreview}>
          <Image source={{ uri: mediaUri }} style={styles.previewImage} />
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Write a caption for your post!</Text>
          <TextInput
            style={styles.input}
            placeholder="Fun."
            placeholderTextColor={colors.input.placeholder}
            value={caption}
            onChangeText={setCaption}
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
          />
          <Pressable 
            onPress={handleGetLocation}
            disabled={isLoading}
            style={styles.useLocationButton}
          >
            <Text style={styles.useLocationText}>
              Use current location.
            </Text>
          </Pressable>
        </View>
  
        {/* Espacio adicional para asegurar que el scroll llegue abajo del botón */}
        <View style={{ height: 80 }} />
      </ScrollView>
  
      {/* Botón fijo abajo */}
      <View style={styles.buttonContainer}>
        <Button
          title="Post"
          onPress={handlePost}
          variant="green"
          disabled={!caption.trim() || !location.trim()}
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