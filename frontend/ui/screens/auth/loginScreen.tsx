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
import { login, googleLogin } from '@redux/slices/authSlice';
import { LoginCredentials } from '@components/auth/types';
import googleIcon from '@assets/icons/btn_google/web_dark_sq_ctn.svg';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList & RootStackParamList>;

WebBrowser.maybeCompleteAuthSession(); 

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "208172994015-qa2omqpdao2ucm0h5906h3vakd4ioitg.apps.googleusercontent.com",
    iosClientId: "208172994015-p954m10oc3d7u52vj9s3eavhk7i926eo.apps.googleusercontent.com",
    androidClientId: "208172994015-enmskd9colnpgps7pk2aj270n89mt6n2.apps.googleusercontent.com",
    scopes: ['profile', 'email']
  });

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
      //console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await promptAsync();
      console.log("Google result:", result);
  
      if (result?.type === 'success') {
        // Obtener el token directamente de la autenticación
        const { authentication } = result;
        if (!authentication) {
          throw new Error('No authentication data received');
        }
  
        const { accessToken } = authentication;
        
        try {
          // Obtener información del usuario de Google
          const userInfoResponse = await fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          
          if (!userInfoResponse.ok) {
            throw new Error('Failed to get user info from Google');
          }
  
          const googleUser = await userInfoResponse.json();
          console.log("Google user info:", googleUser);
  
          // Usar el ID de Google como token
          await dispatch(googleLogin({ token: accessToken })).unwrap();
          
        } catch (error) {
          console.error('Error fetching Google user info:', error);
          setError('Failed to get user information from Google');
        }
      } else if (result?.type === 'error') {
        console.error('Google Sign In Error:', result.error);
        setError(result.error?.message || 'Google sign in failed');
      } else {
        setError('Google sign in was cancelled');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(error?.message || 'Failed to login with Google');
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
            onPress={handleGoogleLogin}
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