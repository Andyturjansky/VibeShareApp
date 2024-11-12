export type GenderType = '' | 'male' | 'female' | 'nonBinary' | 'preferNotToSay';

export interface AuthState {
  user: UserAuth | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserAuth {
  id: string;
  email: string;
  token: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: GenderType;
  profilePicture?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
  firstName: string;
  lastName: string;
  gender: GenderType;
  profilePicture?: string;
}

export interface AuthResponse {
  user: UserAuth;
  token: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: GenderType;
}

export type RegisterStep = 'form' | 'profile-picture' | 'welcome';
