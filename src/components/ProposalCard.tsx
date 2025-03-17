import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Proposal} from '../types';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ProposalCardProps {
  proposal: Proposal;
  onAccept?: () => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onAccept,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.price}>
          <Icon name="money" size={16} /> {proposal.price} ₴
        </Text>
        <Text style={styles.timeframe}>
          <Icon name="clock-o" size={16} /> {proposal.timeframe}
        </Text>
      </View>
      <Text style={styles.comment}>{proposal.comment}</Text>
      <Text style={styles.date}>
        {new Date(proposal.createdAt).toLocaleDateString()}
      </Text>
      {onAccept && (
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Icon name="check" size={16} color="#fff" />
          <Text style={styles.acceptButtonText}>Accept Proposal</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  timeframe: {
    fontSize: 16,
    color: '#666',
  },
  comment: {
    fontSize: 16,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: '#2ecc71',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
  },
  acceptButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
});
