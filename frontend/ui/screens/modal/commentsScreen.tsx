import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CommentList from '@components/comment/commentList';
import CommentInput from '@components/comment/commentInput';
import { createCommentThunk } from '@redux/thunks/commentThunks';
import { selectPostById } from '@redux/slices/postsSlice';
import { AppDispatch, RootState } from '@redux/store';

interface CommentsScreenProps {
  route: {
    params: {
      postId: string;
    };
  };
  navigation: any;
}

const CommentsScreen = ({ route, navigation }: CommentsScreenProps) => {
  const { postId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Obtener el post y sus comentarios del estado
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  
  // Manejar caso donde el post no existe
  if (!post) {
    // Podrías mostrar un error o redirigir
    return null;
  }

  const handleCommentSubmit = async (text: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Obtener usuario actual del estado de autenticación
      const currentUser = {
        id: 'current-user-id',
        username: 'current-user',
        profilePicture: 'https://example.com/avatar.jpg'
      };

      await dispatch(createCommentThunk({
        postId,
        text,
        //user: currentUser
      })).unwrap();
    } catch (error) {
      // Manejar error
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('Profile', { userId });
  };

  return (
    <View style={styles.container}>
      <CommentList 
        comments={post.comments}
        onUserPress={handleUserPress}
      />
      <CommentInput
        postId={postId}
        onCommentSubmit={handleCommentSubmit}
        isLoading={isSubmitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default CommentsScreen;