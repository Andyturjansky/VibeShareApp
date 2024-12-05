import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet, Share } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@styles/colors';
import { Ad } from '@redux/slices/adsSlice';

interface AdComponentProps {
  ad: Ad;
}

const AdComponent = ({ ad }: AdComponentProps) => {
    // Validación temprana
    if (!ad) return null;
  
    const handleUrlPress = async () => {
      if (!ad?.Url) return; // Validación de URL
      
      try {
        await Linking.openURL(ad.Url);
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    };
  
    const handleShare = async () => {
      if (!ad?.Url || !ad?.commerce) return; // Validación de datos necesarios
      
      try {
        await Share.share({
          url: ad.Url,
          message: `Échale un vistazo a ${ad.commerce}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    };
  
    // Validación de imagen
    const imageUrl = ad.imagePath?.[0]?.portraite;
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.advertiserName}>{ad.commerce || 'Anunciante'}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleUrlPress}>
              <Feather name="globe" size={24} color={colors.text.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Feather name="share-2" size={24} color={colors.text.white} />
            </TouchableOpacity>
          </View>
        </View>
        {imageUrl && (
          <TouchableOpacity onPress={handleUrlPress}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    backgroundColor: colors.background.black,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  advertiserName: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  shareButton: {
    marginLeft: 8,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
});

export default AdComponent;