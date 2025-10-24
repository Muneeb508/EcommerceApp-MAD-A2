import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  Text,
  Button,
  TextInput,
  ActivityIndicator,
  Avatar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import api from '@/config/api';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface Order {
  _id: string;
  total_amount: number;
  status: string;
  order_date: string;
  items: any[];
}

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAddress(user.address || '');
      setPhone(user.phone || '');
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ name, address, phone });
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            router.replace('/(tabs)');
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.authHeader}
        >
          <Ionicons name="person-circle-outline" size={100} color={Colors.textWhite} />
          <Text style={styles.authTitle}>Welcome!</Text>
          <Text style={styles.authSubtitle}>Login to access your profile</Text>
        </LinearGradient>

        <View style={styles.authContent}>
          <Button
            mode="contained"
            onPress={() => router.push('/auth/login')}
            style={styles.authButton}
            buttonColor={Colors.primary}
            contentStyle={styles.authButtonContent}
          >
            Login
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push('/auth/signup')}
            style={styles.authButton}
            textColor={Colors.primary}
            contentStyle={styles.authButtonContent}
          >
            Sign Up
          </Button>
        </View>
      </View>
    );
  }

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
      
      {/* Profile Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.profileHeader}
      >
        <Avatar.Text
          size={80}
          label={user.name.substring(0, 2).toUpperCase()}
          style={styles.avatar}
          color={Colors.primary}
          labelStyle={styles.avatarLabel}
        />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Profile Information</Text>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Ionicons name="create-outline" size={24} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <>
              <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                mode="outlined"
                outlineColor={Colors.border}
                activeOutlineColor={Colors.primary}
                left={<TextInput.Icon icon="account" />}
              />
              <TextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
                style={styles.input}
                mode="outlined"
                outlineColor={Colors.border}
                activeOutlineColor={Colors.primary}
                left={<TextInput.Icon icon="map-marker" />}
              />
              <TextInput
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
                mode="outlined"
                outlineColor={Colors.border}
                activeOutlineColor={Colors.primary}
                left={<TextInput.Icon icon="phone" />}
              />
              <View style={styles.buttonRow}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setEditing(false);
                    setName(user.name);
                    setAddress(user.address || '');
                    setPhone(user.phone || '');
                  }}
                  style={styles.cancelButton}
                  textColor={Colors.textSecondary}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleUpdateProfile}
                  style={styles.saveButton}
                  buttonColor={Colors.primary}
                >
                  Save Changes
                </Button>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={20} color={Colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{user.name}</Text>
                </View>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={20} color={Colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{user.address || 'Not set'}</Text>
                </View>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={20} color={Colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{user.phone || 'Not set'}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Order History Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order History</Text>
          
          {orders.length === 0 ? (
            <View style={styles.noOrders}>
              <Ionicons name="receipt-outline" size={48} color={Colors.textLight} />
              <Text style={styles.noOrdersText}>No orders yet</Text>
            </View>
          ) : (
            orders.map((order) => (
              <TouchableOpacity key={order._id} style={styles.orderItem}>
                <View style={styles.orderIcon}>
                  <Ionicons name="bag-handle-outline" size={24} color={Colors.primary} />
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderId}>#{order._id.substring(0, 8).toUpperCase()}</Text>
                  <Text style={styles.orderInfo}>
                    {order.items.length} items • {order.status}
                  </Text>
                </View>
                <Text style={styles.orderAmount}>${order.total_amount.toFixed(2)}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogout}>
          <View style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  authHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textWhite,
    marginTop: 16,
  },
  authSubtitle: {
    fontSize: 14,
    color: Colors.textWhite,
    opacity: 0.9,
    marginTop: 8,
  },
  authContent: {
    padding: 32,
  },
  authButton: {
    borderRadius: 12,
    marginBottom: 16,
  },
  authButtonContent: {
    paddingVertical: 8,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatar: {
    backgroundColor: Colors.surface,
  },
  avatarLabel: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textWhite,
    marginTop: 16,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textWhite,
    opacity: 0.9,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    marginTop: -16,
  },
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.surface,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
  },
  saveButton: {
    flex: 1,
    borderRadius: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  noOrders: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noOrdersText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderDetails: {
    flex: 1,
    marginLeft: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  orderInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error + '10',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 12,
  },
});
