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
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  getRequestById,
  getProposals,
  saveProposal,
} from '../services/firebaseHelpers';
import {Request, Proposal} from '../types';
import {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RequestDetails'>;

export const RequestDetailsScreen: React.FC<Props> = ({route}) => {
  const {requestId} = route.params;
  const [request, setRequest] = useState<Request | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const loadRequestDetails = useCallback(async () => {
    try {
      const requestData = await getRequestById(requestId);
      if (requestData) {
        setRequest(requestData);
        const proposalsData = await getProposals(requestId);
        setProposals(proposalsData);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load request details');
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  proposalDescription: {
    fontSize: 16,
  },
});
