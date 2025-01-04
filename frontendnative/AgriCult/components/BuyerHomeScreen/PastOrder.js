import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "react-native-vector-icons/Ionicons";

const OrderCard = ({ order, length }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.orderNoContainer}>
          <Text style={styles.orderNoLabel}>#{length}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Inactive</Text>
          </View>
        </View>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.dateText}>{formatDate(order.created_at)}</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.detailsRow}>
          <View style={styles.detailColumn}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Quantity</Text>
              <Text style={styles.value}>{order.quantity} Tons</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Quality</Text>
              <Text style={styles.value}>{order.quality}</Text>
            </View>
          </View>
          <View style={styles.regionContainer}>
            <Text style={styles.regionText}>{order.region}</Text>
          </View>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#1E7C57" />
          <Text style={styles.locationText} numberOfLines={1}>
            {order.deliveryLocation}
          </Text>
        </View>
      </View>
    </View>
  );
};

const InactiveOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found');
      }

      const userData = JSON.parse(userDataString);
      const userName = userData.userName;

      const response = await fetch(`https://agricult.onrender.com/fetch/orders?userName=${userName}&status=false`);
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
        <ActivityIndicator size="large" color="#ff4444" />
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
          <Text style={styles.noOrdersText}>No inactive orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <OrderCard order={item} length={orders.length} />}
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderNoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderNoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E7C57',
  },
  statusBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FF4444',
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  mainContent: {
    padding: 12,
    gap: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailColumn: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    gap: 2,
  },
  label: {
    fontSize: 11,
    color: '#666',
  },
  value: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  regionContainer: {
    backgroundColor: '#E9F5F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E7C57',
  },
  regionText: {
    fontSize: 12,
    color: '#1E7C57',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  noOrdersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default InactiveOrdersScreen;