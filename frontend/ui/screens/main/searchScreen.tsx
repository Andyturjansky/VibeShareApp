import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { profileAPI } from '@networking/api/profile';
import { UserListItem } from '@components/profile/userList/userListItem';
import { colors } from '@styles/colors';
import { SearchUserResult } from '@components/profile/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<SearchUserResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
  
    try {
      const results = await profileAPI.searchUsers({ username: searchQuery });
      setUsers(results);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Si no se encontraron usuarios
        setUsers([]);
      } else {
        setError('Error searching for users');
        console.error('Search error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery.length > 0
          ? 'No users found'
          : 'Search for users by username'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor={colors.text.grey}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          autoCapitalize="none"
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.green} style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
    <FlatList
    data={users}
    keyExtractor={item => item._id.toString()}  // Asegurarse que sea string
    renderItem={({ item }) => (
        <UserListItem
        key={item._id.toString()}  // Agregar key explícita
        id={item._id}
        profilePicture={item.profilePicture}
        username={item.username}
        firstName={item.name}
        lastName={item.surname}
        navigation={navigation}
        />
    )}
    ListEmptyComponent={renderEmptyState}
    />
      )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.black,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: colors.background.black,
    borderRadius: 20,
    paddingHorizontal: 16,
    color: colors.text.white,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: colors.green,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: colors.text.white,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
  },
  errorText: {
    color: colors.text.red,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: colors.text.grey,
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.black,
  },
});

export default SearchScreen;