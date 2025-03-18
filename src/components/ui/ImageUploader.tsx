import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Asset} from 'react-native-image-picker';

interface ImageUploaderProps {
  photos: Array<
    Asset & {localUri: string; uploading?: boolean; error?: boolean}
  >;
  onSelectImage: () => Promise<void>;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
  isSubmitting?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  photos,
  onSelectImage,
  onRemoveImage,
  maxImages = 3,
  isSubmitting = false,
}) => {
  return (
    <>
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
                  onPress={() => onRemoveImage(index)}>
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {photos.length < maxImages && (
        <TouchableOpacity
          style={styles.imageButton}
          onPress={onSelectImage}
          disabled={isSubmitting}>
          <Text style={styles.imageButtonText}>
            Add Photos ({photos.length}/{maxImages})
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
    ...StyleSheet.absoluteFillObject,
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
});
