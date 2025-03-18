import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Request} from '../types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../constants';
import {NavigationProp} from '../types/navigation';

interface RequestCardProps {
  request: Request;
}

export const RequestCard: React.FC<RequestCardProps> = ({request}) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate(ROUTES.REQUEST_DETAILS, {requestId: request.id})
      }>
      {request.photos.length > 0 && (
        <Image source={{uri: request.photos[0]}} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.category}>
          <Icon name="tag" size={14} /> {request.categoryId}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {request.description}
        </Text>
        <Text style={styles.date}>
          {new Date(request.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
