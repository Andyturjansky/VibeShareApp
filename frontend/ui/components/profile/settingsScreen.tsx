import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Pressable } from 'react-native';
import { colors } from '@styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@context/auth';

interface SettingItemProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isDestructive?: boolean;
}

const SettingItem = ({
  label,
  icon,
  onPress,
  isDestructive = false,
} : SettingItemProps) => (
  <Pressable
    style={({ pressed }) => [
      styles.settingItem,
      pressed && styles.pressed,
    ]}
    onPress={onPress}
  >
    <View style={styles.settingContent}>
      <Ionicons
        name={icon}
        size={24}
        color={isDestructive ? colors.text.red : colors.text.white}
      />
      <Text style={[
        styles.settingLabel,
        isDestructive && styles.destructiveText
      ]}>
        {label}
      </Text>
    </View>
    <Ionicons
      name="chevron-forward"
      size={24}
      color={colors.text.grey}
    />
  </Pressable>
);

export const SettingsScreen = () => {
  const { logout, deleteAccount } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    if (isLoading) return; 

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            setIsLoading(true);
            try {
              console.log('🔄 Iniciando proceso de logout...');
              await logout();
              console.log('✅ Logout completado exitosamente');
            } catch (error) {
              console.error('❌ Error durante logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: !isLoading }  
    );
  }, [logout, isLoading]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteAccount();
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  }, [deleteAccount]);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem
          label="Logout"
          icon="log-out-outline"
          onPress={handleLogout}
          isDestructive
        />
        <SettingItem
          label="Delete Account"
          icon="trash-outline"
          onPress={handleDeleteAccount}
          isDestructive
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.black,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: colors.text.grey,
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.input.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text.white,
    marginLeft: 12,
  },
  destructiveText: {
    color: colors.text.red,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default SettingsScreen;