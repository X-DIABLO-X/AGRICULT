import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const PastBidsScreen = () => {
  const pastBids = [
    { id: '1', title: 'Project A', amount: '$200', status: 'Won' },
    { id: '2', title: 'Project B', amount: '$150', status: 'Lost' },
    { id: '3', title: 'Project C', amount: '$300', status: 'Pending' },
  ];

  const renderBidItem = ({ item }) => (
    <View style={styles.bidItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.amount}>{item.amount}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Past Bids</Text>
      <FlatList
        data={pastBids}
        keyExtractor={(item) => item.id}
        renderItem={renderBidItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E7C57',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  bidItem: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E7C57',
  },
  amount: {
    fontSize: 16,
    color: '#555',
  },
  status: {
    fontSize: 14,
    color: '#888',
  },
});

export default PastBidsScreen;
