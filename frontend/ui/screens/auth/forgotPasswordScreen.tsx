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
import { useAppDispatch } from '@redux/hooks';
import { sendVerificationCode } from '@redux/slices/authSlice';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleIdentifierChange = (text: string) => {
    setIdentifier(text);
    setError(undefined);
  };

  const handleSendCode = async () => {
    if (!identifier.trim()) {
      setError('Please enter your email or username');
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(sendVerificationCode(identifier.trim())).unwrap();
      navigation.navigate(Routes.VerificationCode, { email: identifier.trim() });
    } catch (error) {
      setError(typeof error === 'string' ? error : 'User not found');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Lock size={32} color={colors.text.white} />
          </View>

          <Text style={styles.title}>Trouble with logging in?</Text>
          <Text style={styles.subtitle}>
            Enter your email address or username, and we'll send you a verification code to get back into your account.
          </Text>

          <View style={styles.inputContainer}>
            <Input
              placeholder="Email or Username"
              value={identifier}
              onChangeText={handleIdentifierChange}
              autoCapitalize="none"
              error={error}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button 
              title="Send Verification Code"
              onPress={handleSendCode}
              variant="green"
              disabled={isLoading}
              loading={isLoading}
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