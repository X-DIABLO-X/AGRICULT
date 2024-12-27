import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderCard = ({ order }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.orderNo}>Order No: {order.id}</Text>
      <View style={styles.orderDetails}>
        <Text style={styles.orderText}>Quality: {order.quality}</Text>
        <Text style={styles.orderText}>Quantity: {order.quantity}</Text>
        <Text style={styles.orderText}>Region: {order.region}</Text>
        <Text style={styles.orderText}>Loading Date: {formatDate(order.loadingDate)}</Text>
        <Text style={styles.orderText}>Delivery Location: {order.deliveryLocation}</Text>
        <Text style={styles.orderText}>Created: {formatDate(order.created_at)}</Text>
      </View>
    </View>
  );
};

const ActiveOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      // Get user data from AsyncStorage
      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found');
      }

      const userData = JSON.parse(userDataString);
      const userName = userData.userName;

      // Fetch orders from your API
      const response = await fetch(`https://00z67rj6-3000.inc1.devtunnels.ms/fetch/orders?userName=${userName}&status=true`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      setOrders(data.orders);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noOrdersText}>No active orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={fetchUserOrders}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#4caf50',
  },
  orderNo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 8,
  },
  orderDetails: {
    marginTop: 4,
  },
  orderText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noOrdersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ActiveOrdersScreen;