import React from 'react';
import { Modal, View, Image, Pressable, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface PostImageViewerProps {
  imageUrl: string;
  mediaType: 'image' | 'video';
  isVisible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const PostImageViewer = ({
  imageUrl,
  mediaType,
  isVisible,
  onClose,
} : PostImageViewerProps) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <Pressable
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </Pressable>
        
        <View style={styles.imageContainer}>
          {mediaType === 'video' ? (
            <Video
              source={{ uri: imageUrl }}
              style={styles.fullImage}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              //isLooping
              shouldPlay={true}
            />
          ) : (
            <Image
              source={{ uri: imageUrl }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height * 0.8,
  },
});

export default PostImageViewer;