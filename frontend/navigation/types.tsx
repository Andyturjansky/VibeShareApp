import { NavigatorScreenParams } from '@react-navigation/native';

export enum Routes {
  // Auth Stack
  Auth = 'Auth', 
  Login = 'Login',
  Register = 'Register',
  ForgotPassword = 'ForgotPassword',
  VerificationCode = 'VerificationCode',
  ProfilePicture = 'ProfilePicture',
  Welcome = 'Welcome', 

  // Main Tabs
  MainTabs = 'MainTabs',
  Home = 'Home',
  Search = 'Search',
  NewPost = 'NewPost', 
  Activity = 'Activity',
  Profile = 'Profile',

  // Profile Stack
  ProfileStack = 'ProfileStack',
  ProfileMain = 'ProfileMain', // Nueva ruta para la pantalla principal de perfil
  Favorites = 'Favorites',
  EditProfile = 'EditProfile',
  Settings = 'Settings',
  Followers = 'Followers',    
  Following = 'Following',    

  // Post Stack
  SelectMedia = 'SelectMedia',
  CreatePost = 'CreatePost',

  // Modal Screens
  Comments = 'Comments',
  PostOptions = 'PostOptions',
}

// Parámetros del stack de autenticación
export type AuthStackParamList = {
  [Routes.Login]: { redirectTo?: string };
  [Routes.Register]: undefined;
  [Routes.ForgotPassword]: { email?: string };
  [Routes.VerificationCode]: { email: string };
  [Routes.ProfilePicture]: undefined;
  [Routes.Welcome]: undefined; 
};

// Parámetros para tabs principales
export type MainTabsParamList = {
  [Routes.Home]: undefined;
  [Routes.Search]: { initialQuery?: string };
  [Routes.NewPost]: undefined;
  [Routes.Activity]: undefined;
  [Routes.Profile]: undefined;
};

// Parámetros del stack de perfil
export type ProfileStackParamList = {
  [Routes.ProfileMain]: { userId?: string }; // Cambio de Profile a ProfileMain
  [Routes.Favorites]: undefined;
  [Routes.EditProfile]: undefined;
  [Routes.Settings]: undefined;
  [Routes.Followers]: { userId: string };
  [Routes.Following]: { userId: string };
};

// Parámetros del stack de creación de posts
export type PostStackParamList = {
  [Routes.SelectMedia]: undefined;
  [Routes.CreatePost]: { mediaUri: string; mediaType: 'image' | 'video' };
};

// Parámetros de modales
export type ModalStackParamList = {
  [Routes.Comments]: { postId: string };
  [Routes.PostOptions]: { postId: string; isOwnPost: boolean };
};

// Definición global de RootStackParamList
export type RootStackParamList = {
  [Routes.Auth]: NavigatorScreenParams<AuthStackParamList>;
  [Routes.MainTabs]: NavigatorScreenParams<MainTabsParamList>;
  [Routes.ProfileStack]: NavigatorScreenParams<ProfileStackParamList>;
  [Routes.SelectMedia]: NavigatorScreenParams<PostStackParamList>;
  [Routes.Comments]: { postId: string };
};