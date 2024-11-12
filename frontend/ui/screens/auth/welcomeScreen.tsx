import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';
import { Routes } from '@navigation/types';
import { Logo } from '@components/common/logo';
import { Avatar } from '@components/avatar';
import { colors } from '@styles/colors';
import { useAuth } from '@context/auth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  const handleEnter = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: Routes.MainTabs }]
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Logo size="medium" />
        </View>

        <View style={styles.mainContent}>
          <View style={styles.avatarContainer}>
            <Avatar
              size="xlarge"
              imageUrl={user?.profilePicture}
              showBorder={false}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>
              Welcome to VibeShare, {user?.username}
            </Text>
            <Text style={styles.description}>
              Let's start customizing your experience
            </Text>
          </View>
        </View>

        <View style={styles.footerContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.enterButton,
            pressed && { opacity: 0.8 }
          ]}
          onPress={handleEnter}
        >
          <Image 
          source={require('@assets/images/adaptive-icon.png')}
          style={styles.logoImage}
          resizeMode="contain"
          />
        </Pressable>
    
          <Text style={styles.hint}>
            Press the button to enter, you will be redirected to your profile
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.black,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    width: '100%',
    paddingVertical: 28,
    alignItems: 'center',
    marginTop: 30,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
  },
  avatarContainer: {
    marginBottom: 32,
  },
  textContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    color: colors.text.grey,
    fontSize: 16,
    textAlign: 'center',
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  enterButton: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },  
  hint: {
    color: colors.text.grey,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '80%',
  },
});

export default WelcomeScreen;