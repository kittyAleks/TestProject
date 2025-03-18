import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {saveRating} from '../services/firebaseHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'Rating'>;

const MAX_RATING = 5;

export const RatingScreen: React.FC<Props> = ({route, navigation}) => {
  const {proposalId} = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveRating({
        proposalId,
        rating,
        comment,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Thank you for your rating!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Error saving rating:', error);
      Alert.alert('Error', 'Failed to save rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate the Service</Text>

      <View style={styles.starsContainer}>
        {[...Array(MAX_RATING)].map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleStarPress(index + 1)}
            disabled={isSubmitting}>
            <Text style={[styles.star, rating > index && styles.starSelected]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.ratingText}>
        {rating > 0 ? `${rating} of ${MAX_RATING} stars` : 'Select rating'}
      </Text>

      <Text style={styles.label}>Comment (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Share your experience..."
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={4}
        editable={!isSubmitting}
      />

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Rating</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  star: {
    fontSize: 40,
    color: '#ddd',
    marginHorizontal: 5,
  },
  starSelected: {
    color: '#ffd700',
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
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
    marginBottom: 20,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#f4511e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
