import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@styles/colors';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'green' | 'black';
  disabled?: boolean;
  loading?: boolean;
};

export const Button = ({ 
  title, 
  onPress, 
  variant = 'green', 
  disabled, 
  loading 
}: ButtonProps) => (
  <Pressable 
    style={({ pressed }) => [
      styles.button, 
      styles[variant], 
      { opacity: pressed ? 0.7 : (disabled || loading) ? 0.5 : 1 },
      (disabled || loading) && styles.disabled
    ]} 
    onPress={onPress}
    disabled={disabled || loading}
  >
    {loading ? (
      <ActivityIndicator 
        color={variant === 'black' ? colors.text.green : colors.text.white} 
        size="small"
      />
    ) : (
      <Text style={[styles.buttonText, variant === 'black' && styles.blackText]}>
        {title}
      </Text>
    )}
  </Pressable>
);

// Mantenemos los estilos exactamente como estaban
const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  green: {
    backgroundColor: colors.green,
  },
  black: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF33',
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '500',
  },
  blackText: {
    marginLeft: 10,
  },
  disabled: {
    backgroundColor: colors.green + '80', 
  },
});

export default Button;