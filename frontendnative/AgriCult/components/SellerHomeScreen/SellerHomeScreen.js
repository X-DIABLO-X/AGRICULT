import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';

const App = () => {
  // Sample data for orders
  const orders = [
    { id: '1', product: 'Wheat', region: 'North', bid: null, bidCount: 0 },
    { id: '2', product: 'Lime', region: 'South', bid: null, bidCount: 0 },
    { id: '3', product: 'Grapes', region: 'North', bid: null, bidCount: 0 },
    { id: '4', product: 'Crop Solution', region: 'East', bid: null, bidCount: 0 },
  ];

  const [userRegion, setUserRegion] = useState('North');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [bids, setBids] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const regionFiltered = orders.filter(order => order.region === userRegion);
    setFilteredOrders(regionFiltered);
  }, [userRegion]);

  const handleLogout = () => {
    console.log('User logged out');
  };

  const handleBid = (orderId, bidAmount) => {
    setBids({ ...bids, [orderId]: bidAmount });

    const updatedOrders = filteredOrders.map(order => {
      if (order.id === orderId) {
        return { ...order, bidCount: order.bidCount + 1 };
      }
      return order;
    });

    setFilteredOrders(updatedOrders);
    console.log(`Bid placed on order ${orderId}: ${bidAmount}`);
  };

  const openOrderDetails = (orderId) => {
    const order = filteredOrders.find(o => o.id === orderId);
    setOrderDetails(order);
    setModalVisible(true);
  };

  const closeOrderDetails = () => {
    setModalVisible(false);
    setOrderDetails(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.profileText}>Hi, Wilson!</Text>
        <Text style={styles.regionText}>Region: {userRegion}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title}>Orders in Your Region</Text>
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.productText}>{item.product}</Text>
              <Text style={styles.regionLabel}>{item.region}</Text>
              <TextInput
                style={styles.bidInput}
                placeholder="Enter your bid"
                keyboardType="numeric"
                onChangeText={(text) => handleBid(item.id, text)}
              />
              <TouchableOpacity
                style={styles.bidButton}
                onPress={() => console.log(`Bid confirmed for order ${item.id} with bid: ${bids[item.id]}`)}
              >
                <Text style={styles.bidButtonText}>Make a Bid</Text>
              </TouchableOpacity>
              <Text style={styles.bidText}>Your Bid: {bids[item.id] || 'None'}</Text>
              <Text style={styles.bidCountText}>Number of Bids: {item.bidCount}</Text>
              
              {/* Order Details Button */}
              <TouchableOpacity
                style={styles.orderDetailsButton}
                onPress={() => openOrderDetails(item.id)}
              >
                <Text style={styles.orderDetailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Modal to Show Order Details */}
      {orderDetails && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeOrderDetails}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <Text style={styles.modalText}>Product: {orderDetails.product}</Text>
              <Text style={styles.modalText}>Region: {orderDetails.region}</Text>
              <Text style={styles.modalText}>Bids: {orderDetails.bidCount}</Text>
              <TouchableOpacity style={styles.closeModalButton} onPress={closeOrderDetails}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 18,
    color: '#fff',
  },
  regionText: {
    fontSize: 16,
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productText: {
    fontSize: 16,
    fontWeight: '600',
  },
  regionLabel: {
    fontSize: 14,
    color: '#757575',
  },
  bidInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
  },
  bidButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  bidButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bidText: {
    marginTop: 5,
    fontSize: 14,
    color: '#4CAF50',
  },
  bidCountText: {
    marginTop: 5,
    fontSize: 14,
    color: '#FF5722',
  },
  orderDetailsButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  orderDetailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeModalButton: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeModalText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default App;
