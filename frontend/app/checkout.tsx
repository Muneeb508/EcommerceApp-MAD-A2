import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  RadioButton,
  Divider,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/config/api';

export default function CheckoutScreen() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);

  const paymentMethods = ['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'];

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      Alert.alert('Error', 'Please enter a shipping address');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/orders', {
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      });

      const orderId = response.data._id;
      await clearCart();
      
      router.replace({
        pathname: '/order-confirmation',
        params: { orderId },
      });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Shipping Address
          </Text>
          <TextInput
            label="Address"
            value={shippingAddress}
            onChangeText={setShippingAddress}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Payment Method
          </Text>
          <RadioButton.Group
            onValueChange={setPaymentMethod}
            value={paymentMethod}
          >
            {paymentMethods.map((method) => (
              <RadioButton.Item
                key={method}
                label={method}
                value={method}
                style={styles.radioItem}
              />
            ))}
          </RadioButton.Group>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Order Summary
          </Text>
          {cartItems.map((item) => (
            <View key={item._id} style={styles.orderItem}>
              <View style={styles.orderItemInfo}>
                <Text variant="bodyLarge" numberOfLines={1}>
                  {item.product_id.name}
                </Text>
                <Text variant="bodyMedium" style={styles.orderItemQty}>
                  Qty: {item.quantity}
                </Text>
              </View>
              <Text variant="bodyLarge" style={styles.orderItemPrice}>
                ${(item.product_id.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          <Divider style={styles.divider} />

          <View style={styles.totalRow}>
            <Text variant="bodyLarge">Subtotal:</Text>
            <Text variant="bodyLarge">${cartTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text variant="bodyLarge">Shipping:</Text>
            <Text variant="bodyLarge">$0.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text variant="bodyLarge">Tax:</Text>
            <Text variant="bodyLarge">$0.00</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.totalRow}>
            <Text variant="headlineSmall" style={styles.totalLabel}>
              Total:
            </Text>
            <Text variant="headlineSmall" style={styles.totalAmount}>
              ${cartTotal.toFixed(2)}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handlePlaceOrder}
        loading={loading}
        disabled={loading}
        style={styles.placeOrderButton}
        contentStyle={styles.placeOrderButtonContent}
      >
        Place Order
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
  card: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
  },
  radioItem: {
    paddingVertical: 4,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    marginVertical: 4,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  placeOrderButton: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  placeOrderButtonContent: {
    paddingVertical: 12,
  },
  bottomSpace: {
    height: 20,
  },
});

