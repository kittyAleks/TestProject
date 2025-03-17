import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {Request, Proposal} from '../types';
import {ProposalCard} from '../components/ProposalCard';
import {RatingStars} from '../components/RatingStars';
import {
  createProposal,
  createRating,
  getRequestProposals,
} from '../services/firebase';

type RequestDetailsRouteProp = RouteProp<RootStackParamList, 'RequestDetails'>;

export const RequestDetailsScreen = () => {
  const route = useRoute<RequestDetailsRouteProp>();
  const [request, setRequest] = useState<Request | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [price, setPrice] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const data = await getRequestProposals(route.params.requestId);
      setProposals(data);
    } catch (error) {
      console.error('Error loading proposals:', error);
    }
  };

  const handleSubmitProposal = async () => {
    if (!price.trim() || !timeframe.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, укажите цену и срок выполнения');
      return;
    }

    setLoading(true);
    try {
      await createProposal({
        requestId: route.params.requestId,
        userId: 'provider123', // TODO: Заменить на реального пользователя
        price: Number(price),
        timeframe,
        comment,
      });

      Alert.alert('Успех', 'Предложение успешно отправлено');
      setPrice('');
      setTimeframe('');
      setComment('');
      loadProposals();
    } catch (error) {
      console.error('Error creating proposal:', error);
      Alert.alert('Ошибка', 'Не удалось отправить предложение');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите рейтинг');
      return;
    }

    setLoading(true);
    try {
      await createRating({
        requestId: route.params.requestId,
        providerId: 'provider123', // TODO: Заменить на реального исполнителя
        userId: 'user123', // TODO: Заменить на реального пользователя
        stars: rating,
        comment: ratingComment,
      });

      Alert.alert('Успех', 'Оценка успешно отправлена');
      setRating(0);
      setRatingComment('');
    } catch (error) {
      console.error('Error creating rating:', error);
      Alert.alert('Ошибка', 'Не удалось отправить оценку');
    } finally {
      setLoading(false);
    }
  };

  if (!request) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {request.photos.map((photo, index) => (
          <Image
            key={index}
            source={{uri: photo}}
            style={styles.photo}
            resizeMode="cover"
          />
        ))}

        <Text style={styles.description}>{request.description}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Предложения</Text>
          {proposals.map(proposal => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onAccept={() => {
                // TODO: Реализовать принятие предложения
                Alert.alert('Info', 'Функционал в разработке');
              }}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Добавить предложение</Text>
          <TextInput
            style={styles.input}
            placeholder="Цена (₴)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Срок выполнения"
            value={timeframe}
            onChangeText={setTimeframe}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Комментарий"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmitProposal}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Отправка...' : 'Отправить предложение'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Оценить исполнителя</Text>
          <RatingStars rating={rating} onRatingChange={setRating} size={30} />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Комментарий к оценке"
            value={ratingComment}
            onChangeText={setRatingComment}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmitRating}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Отправка...' : 'Отправить оценку'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 15,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#f4511e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
