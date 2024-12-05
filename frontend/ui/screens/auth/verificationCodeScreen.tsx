import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from '@navigation/types';
import { Routes } from '@navigation/types';
import { Button } from '@components/common/button';
import { Input } from '@components/common/input';
import { colors } from '@styles/colors';
import { ChevronLeft } from 'lucide-react-native';
import { useAppDispatch } from '@redux/hooks';
import { sendVerificationCode, verifyCode } from '@redux/slices/authSlice';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList & RootStackParamList>;
type VerificationCodeScreenRouteProp = RouteProp<AuthStackParamList, Routes.VerificationCode>;

export const VerificationCodeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VerificationCodeScreenRouteProp>();
  const { email } = route.params;

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    try {
      await dispatch(verifyCode({ 
        emailOrUsername: email, 
        code: code.trim() 
      })).unwrap();
      
      navigation.reset({
        index: 0,
        routes: [{ name: Routes.MainTabs }]
      });
    } catch (error) {
      setError(typeof error === 'string' ? error : 'Invalid verification code');
    }
  };

  const handleResend = async () => {
    try {
      await dispatch(sendVerificationCode(email)).unwrap();
      setError(undefined);
      // Opcional: mostrar un mensaje de éxito
    } catch (error) {
      setError(typeof error === 'string' ? error : 'Failed to resend code');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.7 }
          ]}
        >
          <ChevronLeft color={colors.text.white} size={28} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.mainContent}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            To access your account, enter the verification code that we sent to {email}
          </Text>

          <View style={styles.inputContainer}>
            <Input
              placeholder="Verification Code"
              value={code}
              onChangeText={(text) => {
                setCode(text);
                setError(undefined);
              }}
              keyboardType="number-pad"
              error={error}
            />
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive a code? </Text>
            <Pressable 
              onPress={handleResend}
              style={({ pressed }) => [
                styles.resendButton,
                pressed && { opacity: 0.7 }
              ]}
            >
              <Text style={styles.resendButtonText}>Resend</Text>
            </Pressable>
          </View>

          <View style={styles.buttonContainer}>
            <Button 
              title="Submit" 
              onPress={handleSubmit}
              variant="green"
            />
          </View>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    marginTop: '10%',
  },
  title: {
    color: colors.text.white,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.text.grey,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 2,
  },
  resendContainer: {
    width: '100%', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  resendText: {
    color: colors.text.grey,
    fontSize: 14,
  },
  resendButton: {
    padding: 4,
  },
  resendButtonText: {
    color: colors.text.green,
    fontSize: 14,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default VerificationCodeScreen;