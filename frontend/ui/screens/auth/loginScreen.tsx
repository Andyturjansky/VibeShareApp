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
import { useAppDispatch } from '@redux/hooks';
import { login } from '@redux/slices/authSlice';
import { LoginCredentials } from '@components/auth/types';
import googleIcon from '@assets/icons/btn_google/web_dark_sq_ctn.svg';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList & RootStackParamList>;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Nos fijamos si el input es un email o username para que coincida con el back
      const isEmail = email.includes('@');
      const credentials: LoginCredentials = {
        password,
        ...(isEmail ? { email } : { username: email })
      };
      
      await dispatch(login(credentials)).unwrap();
      /*
      navigation.reset({
        index: 0,
        routes: [{ name: Routes.MainTabs }]
      });
      */
     
    } catch (error: any) {
      setError(error?.message || 'Failed to login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Logo size="medium" />
        </View>

        <View style={styles.form}>
        {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Input
            placeholder="Username or email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(null);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(null);
            }}
            editable={!isLoading}
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

          <Button 
            title={isLoading ? "Signing in..." : "Sign in"} 
            onPress={handleLogin} 
            variant="green"
            disabled={isLoading}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button 
            title="Continue with Google" 
            variant="black" 
            onPress={() => {/* Handle Google login */}}
            disabled={isLoading}
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});