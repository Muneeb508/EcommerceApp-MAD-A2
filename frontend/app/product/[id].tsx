import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  ActivityIndicator,
  Divider,
  TextInput,
  IconButton,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/config/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  rating: number;
  reviews: Array<{
    user: string;
    comment: string;
    rating: number;
    date: string;
  }>;
}

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login to add items to cart',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/auth/login') },
        ]
      );
      return;
    }

    if (!product) return;

    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      Alert.alert('Success', 'Item added to cart');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text variant="titleLarge">Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: product.image_url }} style={styles.productImage} />

        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.productName}>
            {product.name}
          </Text>

          <View style={styles.ratingRow}>
            <Text variant="titleMedium">⭐ {product.rating.toFixed(1)}</Text>
            <Text variant="bodyMedium" style={styles.reviews}>
              ({product.reviews.length} reviews)
            </Text>
          </View>

          <Text variant="headlineLarge" style={styles.price}>
            ${product.price.toFixed(2)}
          </Text>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Description
              </Text>
              <Text variant="bodyLarge">{product.description}</Text>
              
              <Divider style={styles.divider} />

              <View style={styles.infoRow}>
                <Text variant="bodyLarge" style={styles.label}>
                  Category:
                </Text>
                <Text variant="bodyLarge">{product.category}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text variant="bodyLarge" style={styles.label}>
                  Stock:
                </Text>
                <Text
                  variant="bodyLarge"
                  style={[
                    styles.stock,
                    product.stock > 0 ? styles.inStock : styles.outOfStock,
                  ]}
                >
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {product.reviews.length > 0 && (
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Customer Reviews
                </Text>
                {product.reviews.slice(0, 3).map((review, index) => (
                  <View key={index} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text variant="bodyMedium" style={styles.reviewUser}>
                        {review.user}
                      </Text>
                      <Text variant="bodySmall">⭐ {review.rating}</Text>
                    </View>
                    <Text variant="bodyMedium">{review.comment}</Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <IconButton
            icon="minus"
            size={24}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          />
          <Text variant="titleLarge" style={styles.quantity}>
            {quantity}
          </Text>
          <IconButton
            icon="plus"
            size={24}
            onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          />
        </View>
        <Button
          mode="contained"
          onPress={handleAddToCart}
          loading={addingToCart}
          disabled={addingToCart || product.stock === 0}
          style={styles.addButton}
          contentStyle={styles.addButtonContent}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviews: {
    marginLeft: 8,
    color: '#666',
  },
  price: {
    color: '#1976d2',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 80,
  },
  stock: {
    fontWeight: 'bold',
  },
  inStock: {
    color: '#4caf50',
  },
  outOfStock: {
    color: '#d32f2f',
  },
  reviewItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewUser: {
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    elevation: 8,
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantity: {
    marginHorizontal: 8,
    minWidth: 40,
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
  },
  addButtonContent: {
    paddingVertical: 8,
  },
});

