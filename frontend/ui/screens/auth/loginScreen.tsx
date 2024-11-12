import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from '@navigation/types'; 
import { useAuth } from '@context/auth';
import { Routes } from '@navigation/types';
import { Input } from '@components/common/input';
import { Button } from '@components/common/button';
import { Logo } from '@components/common/logo';
import { colors } from '@styles/colors';
import googleIcon from '@assets/icons/btn_google/web_dark_sq_ctn.svg';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList & RootStackParamList>;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: Routes.MainTabs }]
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Logo size="medium" />
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Username or email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <Pressable 
            onPress={() => navigation.navigate(Routes.ForgotPassword, { email })}
            style={({ pressed }) => [
              styles.forgotPassword,
              pressed && styles.pressed
            ]}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </Pressable>

          <Button title="Sign in" onPress={handleLogin} variant="green" />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button 
            title="Continue with Google" 
            variant="black" 
            onPress={() => {/* Handle Google login */}}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Pressable 
          onPress={() => navigation.navigate(Routes.Register)}
          style={({ pressed }) => [
            pressed && styles.pressed
          ]}
        >
          <Text style={styles.signUpText}>Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.black,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    width: '100%',
    paddingVertical: 28,
    marginTop: 10,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingTop: 6,
    marginBottom: 10
  },
  forgotPasswordText: {
    color: colors.text.green,
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 80,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF33',
  },
  dividerText: {
    color: colors.text.grey,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: colors.text.grey, 
  },
  signUpText: {
    color: colors.text.green,
  },
  pressed: {
    opacity: 0.7,
  },
});