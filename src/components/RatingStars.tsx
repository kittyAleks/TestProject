import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  onRatingChange,
}) => {
  const renderStar = (position: number) => {
    const name = position <= rating ? 'star' : 'star-o';

    return (
      <TouchableOpacity
        key={position}
        onPress={() => onRatingChange?.(position)}
        disabled={!onRatingChange}>
        <Icon name={name} size={size} color="#FFD700" style={styles.star} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {Array.from({length: maxRating}, (_, i) => renderStar(i + 1))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 2,
  },
});
