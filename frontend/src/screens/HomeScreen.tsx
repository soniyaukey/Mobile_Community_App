import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Searchbar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius, serviceCategories, shadows } from '../theme';
import apiService from '../services/api';
import { Provider } from '../types';
import { RootStackParamList } from '../types/navigation';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await apiService.getVerifiedProviders();
      setProviders(data);
    } catch (error) {
      console.error('Error loading providers:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProviders();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: string) => {
    navigation.navigate('Search', { category } as any);
  };

  const handleProviderPress = (providerId: number) => {
    navigation.navigate('ProviderDetail', { providerId });
  };

  const renderCategory = ({ item }: { item: typeof serviceCategories[0] }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item.id)}
      testID={`category-${item.id}`}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.categoryEmoji}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProvider = ({ item }: { item: Provider }) => (
    <TouchableOpacity onPress={() => handleProviderPress(item.id)} testID={`provider-card-${item.id}`}>
      <Card style={styles.providerCard}>
        <Card.Content style={styles.providerContent}>
          <View style={styles.providerAvatar}>
            <Text style={styles.providerInitial}>
              {item.businessName?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName} testID={`provider-name-${item.id}`}>{item.businessName}</Text>
            <Text style={styles.providerCategory} testID={`provider-category-${item.id}`}>{item.serviceCategory}</Text>
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
        <Text style={styles.greeting}>Hello! 👋</Text>
        <Text style={styles.title}>Find Local Services</Text>
      </View>

      <Searchbar
        placeholder="Search for services..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        onSubmitEditing={() => navigation.navigate('Search', { query: searchQuery } as any)}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {serviceCategories.map((item) => (
            <View key={item.id} style={styles.categoryGridItem}>
              {renderCategory({ item })}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Top Rated Providers</Text>
        {providers.slice(0, 5).map((provider) => (
          <View key={provider.id}>
            {renderProvider({ item: provider })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  greeting: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginTop: spacing.xs,
  },
  searchbar: {
    margin: spacing.md,
    marginTop: -spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xs,
  },
  categoryGridItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    width: '100%',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  providerCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  providerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerInitial: {
    ...typography.h3,
    color: colors.white,
  },
  providerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  providerName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  providerCategory: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  rating: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.accent,
  },
  reviews: {
    ...typography.small,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    ...typography.h3,
    color: colors.primary,
  },
  priceUnit: {
    ...typography.small,
    color: colors.textSecondary,
  },
});

export default HomeScreen;
