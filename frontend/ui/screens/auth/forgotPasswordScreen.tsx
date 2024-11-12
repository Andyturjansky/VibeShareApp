import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/types';
import { Routes } from '@navigation/types';
import { Button } from '@components/common/button';
import { Input } from '@components/common/input';
import { colors } from '@styles/colors';
import { Lock } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    // Solo validamos si hay texto
    if (text.length > 0 && !validateEmail(text)) {
      setEmailError('Please enter a valid email format (example@domain.com)');
    } else {
      setEmailError(undefined);
    }
  };

  const handleSendCode = () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email format (example@domain.com)');
      return;
    }

    navigation.navigate(Routes.VerificationCode, { email });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Lock 
              size={32} 
              color={colors.text.white}
            />
          </View>

          <Text style={styles.title}>Trouble with logging in?</Text>
          <Text style={styles.subtitle}>
            Enter your email address, and we'll send you a verification code to get back into your account.
          </Text>

          <View style={styles.inputContainer}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={handleEmailChange}
              autoCapitalize="none"
              keyboardType="email-address"
              error={emailError}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button 
              title="Send Verification Code"
              onPress={handleSendCode}
              variant="green"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable 
            onPress={() => navigation.navigate(Routes.Login, { redirectTo: undefined })}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.7 }
            ]}
          >
            <Text style={styles.backText}>
              Back to <Text style={styles.loginText}>log in</Text>
            </Text>
          </Pressable>
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
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -80,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    color: colors.text.white,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  subtitle: {
    color: colors.text.grey,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: '90%',
  },
  inputContainer: {
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: colors.text.white,
    fontSize: 14,
  },
  loginText: {
    color: colors.text.green,
  },
});

export default ForgotPasswordScreen;