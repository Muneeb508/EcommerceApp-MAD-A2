import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { Text, ActivityIndicator, Button, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api from '@/config/api';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  rating: number;
}

export default function CategoriesScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('default');
  const router = useRouter();

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys'];
  const priceRanges = [
    { label: 'All Prices', value: 2000 },
    { label: 'Under $50', value: 50 },
    { label: 'Under $100', value: 100 },
    { label: 'Under $500', value: 500 },
    { label: 'Under $1000', value: 1000 },
  ];
  const sortOptions = [
    { label: 'Default', value: 'default', icon: 'funnel-outline' },
    { label: 'Price: Low', value: 'price-asc', icon: 'arrow-up' },
    { label: 'Price: High', value: 'price-desc', icon: 'arrow-down' },
    { label: 'Name', value: 'name', icon: 'text-outline' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, maxPrice, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        minPrice: 0,
        maxPrice: maxPrice,
        sort: sortBy,
      };
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const response = await api.get('/products', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => router.push(`/product/${item._id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.productCard}>
        <Image source={{ uri: item.image_url }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productDesc} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.productFooter}>
            <View>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={Colors.accent} />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Filters & Sort</Text>
        <Text style={styles.headerSubtitle}>Find your perfect product</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Category Filter */}
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Ionicons name="grid-outline" size={20} color={Colors.primary} />
            <Text style={styles.filterTitle}>Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <Chip
                key={category}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
                style={styles.chip}
                selectedColor={Colors.textWhite}
                mode={selectedCategory === category ? 'flat' : 'outlined'}
                textStyle={selectedCategory === category ? { color: Colors.textWhite } : {}}
              >
                {category}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Price Range */}
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Ionicons name="pricetag-outline" size={20} color={Colors.primary} />
            <Text style={styles.filterTitle}>Price Range</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {priceRanges.map((range) => (
              <Chip
                key={range.value}
                selected={maxPrice === range.value}
                onPress={() => setMaxPrice(range.value)}
                style={styles.chip}
                selectedColor={Colors.textWhite}
                mode={maxPrice === range.value ? 'flat' : 'outlined'}
                textStyle={maxPrice === range.value ? { color: Colors.textWhite } : {}}
              >
                {range.label}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Sort Options */}
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Ionicons name="swap-vertical-outline" size={20} color={Colors.primary} />
            <Text style={styles.filterTitle}>Sort By</Text>
          </View>
          <View style={styles.sortGrid}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sortOption,
                  sortBy === option.value && styles.sortOptionActive,
                ]}
                onPress={() => setSortBy(option.value)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={sortBy === option.value ? Colors.textWhite : Colors.primary}
                />
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === option.value && styles.sortOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Products List */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            {products.length} Products Found
          </Text>
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color={Colors.textLight} />
                <Text style={styles.emptyText}>No products found</Text>
                <Button
                  mode="contained"
                  onPress={fetchProducts}
                  style={styles.retryButton}
                  buttonColor={Colors.primary}
                >
                  Retry
                </Button>
              </View>
            }
          />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textWhite,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textWhite,
    opacity: 0.9,
  },
  filterSection: {
    backgroundColor: Colors.surface,
    padding: 16,
    marginTop: 12,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  chip: {
    marginRight: 8,
  },
  sortGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sortOption: {
    flex: 1,
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  sortOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortOptionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sortOptionTextActive: {
    color: Colors.textWhite,
  },
  resultsSection: {
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 4,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  viewButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    borderRadius: 8,
  },
});
