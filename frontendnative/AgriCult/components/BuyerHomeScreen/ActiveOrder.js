import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

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
      <Text style={styles.orderNo}>Order No: {order.orderNo}</Text>
      <View style={styles.orderDetails}>
        <Text style={styles.orderText}>Quality: {order.quality}</Text>
        <Text style={styles.orderText}>Quantity: {order.quantity}</Text>
        <Text style={styles.orderText}>Region: {order.region}</Text>
        <Text style={styles.orderText}>Date: {order.date}</Text>
      </View>
    </View>
  );
};

// Active Order Screen Component
const ActiveOrdersScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Active Orders</Text> */}
      <FlatList
        data={activeOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.listContent}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
});

export default ActiveOrdersScreen;
