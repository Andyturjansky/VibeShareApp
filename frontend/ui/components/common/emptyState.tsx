import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@styles/colors';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({ message, icon }: EmptyStateProps) => (
  <View style={styles.container}>
    {icon && <View style={styles.iconContainer}>{icon}</View>}
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background.black,
  },
  iconContainer: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: colors.text.grey,
    textAlign: 'center',
  },
});