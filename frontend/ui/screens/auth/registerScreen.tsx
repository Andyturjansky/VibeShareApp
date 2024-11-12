import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { useAuth } from '@context/auth';
import { Input } from '@components/common/input';
import { Button } from '@components/common/button';
import { Logo } from '@components/common/logo';
import { colors } from '@styles/colors';
import { Routes } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RegisterFormData, RegisterCredentials } from '@components/auth/types';
import { AuthStackParamList } from '@navigation/types';
import ArrowDropDownList from '@assets/icons/arrowDropDownList.svg';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const GenderDropdown = ({ 
  value, 
  onChange 
}: { 
  value: string, 
  onChange: (value: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Non-binary', value: 'nonBinary' },
    { label: 'Prefer not to say', value: 'preferNotToSay' },
  ];

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable 
        style={styles.dropdownTrigger} 
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {value ? options.find(opt => opt.value === value)?.label : 'Gender'}
        </Text>
        <ArrowDropDownList width={12} height={12} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.dropdownList}>
            {options.map((option) => (
              <Pressable
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => handleSelect(option.value)}
              >
                <Text style={[
                  styles.dropdownItemText,
                  value === option.value && styles.selectedItemText
                ]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const initialFormData: RegisterFormData = {
  email: '',
  password: '',
  username: '',
  firstName: '',
  lastName: '',
  gender: '',
};

export const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);

  const handleUpdateForm = (key: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    try {
      const credentials: RegisterCredentials = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender
      };

      await register(credentials);
      navigation.navigate(Routes.ProfilePicture);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.logoContainer}>
        <Logo size="medium" />
        <Text style={styles.subtitle}>
          Sign up to see photos and videos from your friends.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleUpdateForm('email', value)}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Input
          placeholder="Name"
          value={formData.firstName}
          onChangeText={(value) => handleUpdateForm('firstName', value)}
        />

        <Input
          placeholder="Surname"
          value={formData.lastName}
          onChangeText={(value) => handleUpdateForm('lastName', value)}
        />

        <Input
          placeholder="Username"
          value={formData.username}
          onChangeText={(value) => handleUpdateForm('username', value)}
          autoCapitalize="none"
        />

        <Input
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleUpdateForm('password', value)}
          secureTextEntry
        />

        <GenderDropdown
          value={formData.gender}
          onChange={(value) => handleUpdateForm('gender', value)}
        />

        <Text style={styles.terms}>
          By signing up, you agree to our Terms, Privacy Policy and Cookie Policy.
        </Text>

        <Button title="Next" onPress={handleNext} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Do you have an account? </Text>
          <Pressable 
            onPress={() => navigation.navigate(Routes.Login, { redirectTo: undefined })}
            style={({ pressed }) => [
              pressed && styles.pressed
            ]}
          >
            <Text style={styles.signInText}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.black,
  },
  contentContainer: {
    padding: 20,
  },
  logoContainer: {
    width: '100%',
    paddingVertical: 28,
    alignItems: 'center',
    marginTop: 30,
  },
  subtitle: {
    color: colors.text.grey,
    textAlign: 'center',
    marginTop: 4,
    fontSize: 16,
    width: '80%', 
    padding: 1, 
    flexWrap: 'wrap', 
    overflow: 'hidden',
  },
  form: {
    width: '100%',
  },
  terms: {
    color: colors.text.grey,
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 70,
  },
  footerText: {
    color: colors.text.grey,
  },
  pressed: {
    opacity: 0.7,
  },
  signInText: {
    color: colors.text.green,
  },
  dropdownTrigger: {
    backgroundColor: colors.input.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF33',
    marginVertical: 8,
    height: 50,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    color: colors.text.white,
    fontSize: 16,
  },
  placeholderText: {
    color: colors.input.placeholder
  },
  arrow: {
    color: colors.text.white,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownList: {
    backgroundColor: colors.input.background,
    borderRadius: 5,
    width: '100%',
    maxWidth: 400,
    padding: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF33',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 3,
  },
  dropdownItemText: {
    color: colors.text.white,
    fontSize: 16,
  },
  selectedItemText: {
    color: colors.text.green,
  },
});

export default RegisterScreen;