import React from 'react';
import { TextInput, StyleSheet, View, Text, ViewStyle } from 'react-native';
import { colors } from '../../styles/colors';

type InputProps = {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  error?: string;
  editable?: boolean;
};

export const Input = ({ 
  placeholder, 
  secureTextEntry, 
  value, 
  onChangeText,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
  error,
  editable = true
}: InputProps) => (
  <View style={styles.container}>
    <TextInput
      style={[
        styles.input,
        error ? styles.inputError : {}
      ] as ViewStyle[]}
      placeholder={placeholder}
      placeholderTextColor={colors.input.placeholder}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      editable={editable} 
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.input.background,
    color: colors.input.text,
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    borderColor: '#FFFFFF33',
    borderWidth: 1,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;