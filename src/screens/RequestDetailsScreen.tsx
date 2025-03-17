import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  getRequestById,
  getProposals,
  saveProposal,
  getRatings,
} from '../services/firebaseHelpers';
import {Request, Proposal, Rating} from '../types';
import {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RequestDetails'>;

export const RequestDetailsScreen: React.FC<Props> = ({route, navigation}) => {
  const {requestId} = route.params;
  const [request, setRequest] = useState<Request | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [ratings, setRatings] = useState<Record<string, Rating[]>>({});
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const loadRequestDetails = useCallback(async () => {
    try {
      const requestData = await getRequestById(requestId);
      if (requestData) {
        setRequest(requestData);
        const proposalsData = await getProposals(requestId);
        setProposals(proposalsData);

        // Загружаем рейтинги для каждого предложения
        const ratingsData: Record<string, Rating[]> = {};
        for (const proposal of proposalsData) {
          const proposalRatings = await getRatings(proposal.id);
          ratingsData[proposal.id] = proposalRatings;
        }
        setRatings(ratingsData);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    loadRequestDetails();
  }, [loadRequestDetails]);

  const handleSubmitProposal = async () => {
    if (!price || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const proposal = {
        requestId,
        price: Number(price),
        description,
        userId: 'provider1', // Mock user ID
        createdAt: new Date(),
      };

      await saveProposal(proposal);
      Alert.alert('Success', 'Proposal submitted successfully');
      loadRequestDetails(); // Reload proposals
      setPrice('');
      setDescription('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit proposal');
    }
  };

  const handleRateProposal = (proposalId: string) => {
    navigation.navigate('Rating', {proposalId});
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  const getAverageRating = (proposalId: string): number => {
    const proposalRatings = ratings[proposalId] || [];
    if (proposalRatings.length === 0) {
      return 0;
    }
    const sum = proposalRatings.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / proposalRatings.length;
  };

  if (!request) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.requestDetails}>
        <Text style={styles.title}>Request Details</Text>
        <Text style={styles.description}>{request.description}</Text>
        <View style={styles.mediaContainer}>
          {request.photos.map((photo, index) => (
            <Image
              key={index}
              source={{uri: photo}}
              style={styles.media}
              resizeMode="cover"
            />
          ))}
        </View>
      </View>

      <View style={styles.proposalForm}>
        <Text style={styles.subtitle}>Submit Proposal</Text>
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmitProposal}>
          <Text style={styles.buttonText}>Submit Proposal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.proposalsList}>
        <Text style={styles.subtitle}>Proposals</Text>
        {proposals.map(proposal => (
          <View key={proposal.id} style={styles.proposalCard}>
            <Text style={styles.price}>${proposal.price}</Text>
            <Text style={styles.proposalDescription}>
              {proposal.description}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                Rating: {getAverageRating(proposal.id).toFixed(1)} ★
              </Text>
              <TouchableOpacity
                style={styles.rateButton}
                onPress={() => handleRateProposal(proposal.id)}>
                <Text style={styles.rateButtonText}>Rate</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  requestDetails: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  media: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  proposalForm: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#f4511e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  proposalsList: {
    padding: 16,
  },
  proposalCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 8,
  },
  proposalDescription: {
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
  },
  rateButton: {
    backgroundColor: '#f4511e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  rateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
