import React, {useState} from 'react';
import {ScrollView, Alert, StyleSheet} from 'react-native';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import {CategoryPicker} from '../components/CategoryPicker';
import {Button} from '../components/ui/Button';
import {TextField} from '../components/ui/TextField';
import {ImageUploader} from '../components/ui/ImageUploader';
import {saveRequest, uploadMedia} from '../services/firebaseHelpers';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {checkStoragePermission} from '../utils/permissions';

type Props = NativeStackScreenProps<RootStackParamList, 'AddRequest'>;

interface SelectedPhoto extends Asset {
  localUri: string;
  uploading?: boolean;
  error?: boolean;
}

export const AddRequestScreen: React.FC<Props> = ({navigation}) => {
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectImage = async () => {
    try {
      const hasPermission = await checkStoragePermission();
      if (!hasPermission) {
        Alert.alert('Error', 'Storage permission is required');
        return;
      }

      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 3 - photos.length,
        includeBase64: false,
      });

      if (result.assets) {
        const selectedPhotos = result.assets.map(asset => ({
          ...asset,
          localUri: asset.uri ?? '',
          uploading: false,
          error: false,
        }));
        setPhotos(prev => [...prev, ...selectedPhotos]);
      }
    } catch (error) {
      console.error('Error selecting photos:', error);
      Alert.alert('Error', 'Failed to select photos');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!categoryId || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedPhotos = await Promise.all(
        photos.map(async photo => {
          try {
            return await uploadMedia(photo.localUri, 'photo');
          } catch (error) {
            console.error('Error uploading photo:', error);
            return null;
          }
        }),
      );

      const requestData = {
        categoryId,
        description: description.trim(),
        photos: uploadedPhotos.filter(Boolean),
        videos: [],
        status: 'active' as const,
        userId: 'user-1',
        location: {
          latitude: 0,
          longitude: 0,
          address: '',
        },
      };

      await saveRequest(requestData);
      Alert.alert('Success', 'Request created successfully', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Error saving request:', error);
      Alert.alert('Error', 'Failed to save request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <CategoryPicker
        selectedCategory={categoryId}
        onSelectCategory={setCategoryId}
      />

      <TextField
        label="Problem Description"
        placeholder="Describe your problem..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        editable={!isSubmitting}
      />

      <ImageUploader
        photos={photos}
        onSelectImage={handleSelectImage}
        onRemoveImage={handleRemovePhoto}
        maxImages={3}
        isSubmitting={isSubmitting}
      />

      <Button
        title="Create Request"
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});
