import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/config/api';

interface Order {
  _id: string;
  user_id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  status: string;
  shipping_address: string;
  payment_method: string;
  order_date: string;
}

export default function OrderConfirmationScreen() {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text variant="titleLarge">Order not found</Text>
        <Button onPress={() => router.replace('/(tabs)')} mode="contained" style={styles.button}>
          Go to Home
        </Button>
      </View>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✓</Text>
        <Text variant="headlineMedium" style={styles.successTitle}>
          Order Placed Successfully!
        </Text>
        <Text variant="bodyLarge" style={styles.successSubtitle}>
          Thank you for your purchase
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Order Details
          </Text>
          <View style={styles.infoRow}>
            <Text variant="bodyLarge" style={styles.label}>
              Order ID:
            </Text>
            <Text variant="bodyLarge" numberOfLines={1} style={styles.value}>
              #{order._id.substring(0, 12)}...
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyLarge" style={styles.label}>
              Status:
            </Text>
            <Text variant="bodyLarge" style={styles.status}>
              {order.status}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyLarge" style={styles.label}>
              Payment:
            </Text>
            <Text variant="bodyLarge">{order.payment_method}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyLarge" style={styles.label}>
              Est. Delivery:
            </Text>
            <Text variant="bodyLarge">
              {estimatedDelivery.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Shipping Address
          </Text>
          <Text variant="bodyLarge">{order.shipping_address}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Order Items
          </Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.orderItemInfo}>
                <Text variant="bodyLarge" numberOfLines={2}>
                  {item.name}
                </Text>
                <Text variant="bodyMedium" style={styles.orderItemQty}>
                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                </Text>
              </View>
              <Text variant="bodyLarge" style={styles.orderItemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          <Divider style={styles.divider} />

          <View style={styles.totalRow}>
            <Text variant="headlineSmall" style={styles.totalLabel}>
              Total Amount:
            </Text>
            <Text variant="headlineSmall" style={styles.totalAmount}>
              ${order.total_amount.toFixed(2)}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => router.replace('/(tabs)')}
        style={styles.homeButton}
        contentStyle={styles.homeButtonContent}
      >
        Continue Shopping
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.replace('/(tabs)/profile')}
        style={styles.ordersButton}
      >
        View All Orders
      </Button>

      <View style={styles.bottomSpace} />
    </ScrollView>
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
    padding: 20,
  },
  successContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  successIcon: {
    fontSize: 72,
    color: '#4caf50',
    marginBottom: 16,
  },
  successTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    textAlign: 'center',
    color: '#666',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 100,
  },
  value: {
    flex: 1,
  },
  status: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderItemInfo: {
    flex: 1,
    marginRight: 8,
  },
  orderItemQty: {
    color: '#666',
    marginTop: 2,
  },
  orderItemPrice: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  button: {
    marginTop: 16,
  },
  homeButton: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  homeButtonContent: {
    paddingVertical: 8,
  },
  ordersButton: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  bottomSpace: {
    height: 20,
  },
});

