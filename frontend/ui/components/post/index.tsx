import React from 'react';
import { View } from 'react-native';
import { PostProps } from './types';
import PostHeader from './postHeader';
import PostImage from './postImage';
import PostActions from './postActions';
import PostDescription from './postDescription';
import { styles } from './styles';

const Post = ({
  post,
  onLikePress,
  onCommentPress,
  onSavePress,
  onUserPress,
  onImagePress,
} : PostProps) => {
  const handleImageLike = (postId: string) => {
    onLikePress?.(postId);
  };

  const handleImagePress = () => {
    onImagePress?.(post.id);
  };

  const handleCommentPress = () => {
    onCommentPress?.(post.id);
  };

  return (
    <View style={styles.container}>
      <PostHeader
        user={post.user}
        location={post.location}
        createdAt={post.createdAt}
        onUserPress={onUserPress}
      />

      <PostImage
        imageUrl={post.imageUrl}
        mediaType={post.mediaType}
        postId={post.id}  
        onLike={handleImageLike}  
        onExpand={handleImagePress}  
      />

      <PostActions
        postId={post.id}
        isLiked={post.isLiked}
        isSaved={post.isSaved}
        commentsCount={post.commentsCount}
        onLikePress={onLikePress || (() => {})}
        onCommentPress={handleCommentPress}
        onSavePress={onSavePress || (() => {})}
      />

      <PostDescription
        description={post.description}
        likesCount={post.likesCount}
        onUserPress={onUserPress}
      />
    </View>
  );
};

export default Post;