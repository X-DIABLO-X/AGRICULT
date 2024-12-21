import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const OrderDetails = ({ order, onClose }) => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Order Details</Text>
      </View>

      {/* Order Details Content */}
      <View style={styles.content}>
        <Text style={styles.label}>Product:</Text>
        <Text style={styles.value}>{order.product}</Text>

        <Text style={styles.label}>Region:</Text>
        <Text style={styles.value}>{order.region}</Text>

        <Text style={styles.label}>Number of Bids:</Text>
        <Text style={styles.value}>{order.bids.length}</Text>

        {/* Past Bids Section */}
        <Text style={styles.label}>Past Bids:</Text>
        {order.bids.length > 0 ? (
          <FlatList
            data={order.bids}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.bidItem}>
                <Text style={styles.bidText}>Bid: {item.bid}</Text>
                <Text style={styles.dateText}>Date: {item.date}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noBidsText}>No bids yet.</Text>
        )}

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  bidItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  bidText: {
    fontSize: 16,
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#757575',
  },
  noBidsText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetails;
