import React from 'react';
import { View, Text, FlatList, StyleSheet, Card } from 'react-native';

// Sample data for active orders
const activeOrders = [
  {
    id: '1',
    orderNo: 'ORD123',
    quality: 'Premium',
    quantity: 10,
    region: 'North',
    date: '2024-12-20',
  },
  {
    id: '2',
    orderNo: 'ORD124',
    quality: 'Standard',
    quantity: 15,
    region: 'South',
    date: '2024-12-21',
  },
  {
    id: '3',
    orderNo: 'ORD125',
    quality: 'Deluxe',
    quantity: 5,
    region: 'East',
    date: '2024-12-22',
  },
];

// Order Card Component
const OrderCard = ({ order }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.orderText}>Order No: {order.orderNo}</Text>
      <Text style={styles.orderText}>Quality: {order.quality}</Text>
      <Text style={styles.orderText}>Quantity: {order.quantity}</Text>
      <Text style={styles.orderText}>Region: {order.region}</Text>
      <Text style={styles.orderText}>Date: {order.date}</Text>
    </View>
  );
};

// Active Order Screen Component
const ActiveOrdersScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={activeOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});

export default ActiveOrdersScreen;
