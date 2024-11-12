import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CommentInputProps } from './types';

const CommentInput = ({ postId, onCommentSubmit, isLoading }: CommentInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return;
    onCommentSubmit(text);
    setText('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Add a comment..."
        placeholderTextColor="#666"
        multiline
      />
      {isLoading ? (
        <ActivityIndicator size="small" color="#0095f6" />
      ) : (
        <Pressable 
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.7 },
            !text.trim() && styles.buttonDisabled
          ]}
          disabled={!text.trim()}
        >
          <Text style={[
            styles.buttonText,
            !text.trim() && styles.buttonTextDisabled
          ]}>
            Post
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#fff',
    marginRight: 8,
    maxHeight: 100
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0EC641',
    borderRadius: 20
  },
  buttonDisabled: {
    backgroundColor: '#1c1c1c'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  buttonTextDisabled: {
    color: '#666'
  }
});

export default React.memo(CommentInput);