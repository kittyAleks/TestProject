import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {saveRating} from '../services/firebaseHelpers';
import {useNavigation, useRoute} from '@react-navigation/native';

export const RatingScreen = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const {proposalId, providerId} = route.params as {
    proposalId: string;
    providerId: string;
  };

  const handleSubmit = async () => {
    try {
      if (rating === 0) {
        Alert.alert('Error', 'Please select rating');
        return;
      }

      await saveRating(proposalId, {
        providerId,
        stars: rating,
        comment,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Rating submitted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving rating:', error);
      Alert.alert('Error', 'Failed to submit rating');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Service Provider</Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}>
            <Icon
              name={star <= rating ? 'star' : 'star-o'}
              size={40}
              color="#f4511e"
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Add a comment (optional)"
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Rating</Text>
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
    marginBottom: 30,
  },
  starButton: {
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#f4511e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
