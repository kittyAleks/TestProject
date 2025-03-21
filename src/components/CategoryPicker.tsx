import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {categories, Category} from '../data/categories';

interface CategoryPickerProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {categories.map((category: Category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory,
            ]}
            onPress={() => onSelectCategory(category.id)}>
            <Icon
              name={category.icon}
              size={24}
              color={selectedCategory === category.id ? '#fff' : '#f4511e'}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText,
              ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#f4511e',
  },
  selectedCategory: {
    backgroundColor: '#f4511e',
  },
  categoryText: {
    marginLeft: 8,
    color: '#f4511e',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
});
