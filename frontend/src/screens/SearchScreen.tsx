import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Chip, Card } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius, serviceCategories, shadows } from '../theme';
import apiService from '../services/api';
import { Provider } from '../types';
import { FAB } from 'react-native-paper';
import { RootStackParamList, TabParamList } from '../types/navigation';



type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type SearchRouteProp = RouteProp<TabParamList, 'Search'>;

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<SearchRouteProp>();
  const [searchQuery, setSearchQuery] = useState(route.params?.query || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(route.params?.category || null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params?.category]);

  useEffect(() => {
    loadProviders();
  }, [selectedCategory]);

  const loadProviders = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedCategory) {
        data = await apiService.getProvidersByCategory(selectedCategory);
      } else {
        data = await apiService.getProviders();
      }
      setProviders(data);
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderPress = (providerId: number) => {
    navigation.navigate('ProviderDetail', { providerId });
  };

  const renderProvider = ({ item }: { item: Provider }) => (
    <TouchableOpacity onPress={() => handleProviderPress(item.id)}>
      <Card style={styles.providerCard}>
        <Card.Content style={styles.providerContent}>
          <View style={styles.providerAvatar}>
            <Text style={styles.providerInitial}>{item.businessName?.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{item.businessName}</Text>
            <Text style={styles.providerCategory}>{item.serviceCategory}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {item.rating?.toFixed(1) || '0.0'}</Text>
              <Text style={styles.reviews}>({item.totalReviews || 0} reviews)</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{item.hourlyRate || '0'}</Text>
            <Text style={styles.priceUnit}>/hr</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Services</Text>
      </View>

      <Searchbar
        placeholder="Search providers..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        onSubmitEditing={loadProviders}
      />

      <View style={styles.categoriesContainer}>
        <FlatList
          data={[{ id: null, name: 'All' }, ...serviceCategories]}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item.id}
              onPress={() => setSelectedCategory(item.id as string | null)}
              style={styles.chip}
              mode={selectedCategory === item.id ? 'flat' : 'outlined'}
            >
              {item.id ? `${item.icon} ` : ''}{item.name}
            </Chip>
          )}
          keyExtractor={(item) => item.id || 'all'}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipList}
        />
      </View>

      <FlatList
        data={providers}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingTop: spacing.xxl, backgroundColor: colors.primary },
  title: { ...typography.h1, color: colors.white },
  searchbar: { margin: spacing.md, borderRadius: borderRadius.lg },
  categoriesContainer: { marginBottom: spacing.sm },
  chipList: { paddingHorizontal: spacing.md },
  chip: { marginRight: spacing.sm },
  list: { padding: spacing.md },
  providerCard: { marginBottom: spacing.md, borderRadius: borderRadius.lg, backgroundColor: colors.surface, ...shadows.sm },
  providerContent: { flexDirection: 'row', alignItems: 'center' },
  providerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  providerInitial: { ...typography.h3, color: colors.white },
  providerInfo: { flex: 1, marginLeft: spacing.md },
  providerName: { ...typography.body, fontWeight: '600', color: colors.textPrimary },
  providerCategory: { ...typography.caption, color: colors.textSecondary },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  rating: { ...typography.caption, fontWeight: '600', color: colors.accent },
  reviews: { ...typography.small, color: colors.textSecondary, marginLeft: spacing.xs },
  priceContainer: { alignItems: 'flex-end' },
  price: { ...typography.h3, color: colors.primary },
  priceUnit: { ...typography.small, color: colors.textSecondary },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default SearchScreen;

