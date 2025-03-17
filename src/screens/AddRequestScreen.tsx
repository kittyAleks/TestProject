import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import {CategoryPicker} from '../components/CategoryPicker';
import {saveRequest} from '../services/firebaseHelpers';
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
  const [categoryId, setCategoryId] = useState<string>('');
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
          localUri: asset.uri!,
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
      const requestData = {
        categoryId,
        description: description.trim(),
        photos: photos.map(photo => photo.localUri),
        videos: [],
        status: 'active' as const,
        createdAt: new Date(),
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
      <Text style={styles.label}>Category</Text>
      <CategoryPicker
        selectedCategory={categoryId}
        onSelectCategory={setCategoryId}
      />

      <Text style={styles.label}>Problem Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe your problem..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        editable={!isSubmitting}
      />

      <Text style={styles.label}>Photos</Text>
      {photos.length > 0 && (
        <ScrollView horizontal style={styles.photoList}>
          {photos.map((photo, index) => (
            <View key={photo.localUri} style={styles.photoContainer}>
              <Image
                source={{uri: photo.localUri}}
                style={[styles.photoPreview, photo.error && styles.photoError]}
              />
              {photo.uploading ? (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color="#fff" />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemovePhoto(index)}>
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {photos.length < 3 && (
        <TouchableOpacity
          style={styles.imageButton}
          onPress={handleSelectImage}
          disabled={isSubmitting}>
          <Text style={styles.imageButtonText}>
            Add Photos ({photos.length}/3)
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Request</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  photoList: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  photoContainer: {
    marginRight: 10,
    position: 'relative',
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  photoError: {
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#ff4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageButton: {
    backgroundColor: '#e7e7e7',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#333',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#f4511e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
