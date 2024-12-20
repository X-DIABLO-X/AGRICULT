import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import PlaceOrder from './PlaceOrder';
import { FlatList } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

const HomeScreen = () => {
  const navigation = useNavigation();
  const [orders] = useState([
    {
      id: '1',
      quantity: '12 tons',
      quality: 'Single Filter',
      region: 'Mandya',
      status: 'Pending',
      date: '2024-03-20',
    },
    {
      id: '2',
      quantity: '15 tons',
      quality: 'Double Filter',
      region: 'Chamarajanagar',
      status: 'Confirmed',
      date: '2024-03-19',
    },
  ]);

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={[
          styles.status,
          { color: item.status === 'Confirmed' ? '#4CAF50' : '#FFA000' }
        ]}>{item.status}</Text>
      </View>
      <View style={styles.orderDetails}>
        <Text>Quantity: {item.quantity}</Text>
        <Text>Quality: {item.quality}</Text>
        <Text>Region: {item.region}</Text>
        <Text>Date: {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Other content goes here */}
      <View style={styles.content}>
        {/* Main content */}
        <Text style={styles.headerTitle}>Your Orders:</Text>
        <FlatList
        data={orders}
        renderItem={renderOrderCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavWrapper}>
        <View style={styles.navBarContainer}>
          <TouchableOpacity onPress={() => console.log('Active Order pressed!')} style={styles.navButton}>
            <Text style={styles.navButtonText}>Active Order</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PlaceOrder')} style={styles.navButtonCenter}>
            <Text style={styles.navButtonText}>Place Order</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Past Order pressed!')} style={styles.navButton}>
            <Text style={styles.navButtonText}>Past Order</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Chat pressed!')} style={styles.navButton}>
            <Text style={styles.navButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const BuyerHomeScreen = () => {
  return (
    <HomeScreen />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  status: {
    fontWeight: 'bold',
  },
  orderDetails: {
    gap: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
  },
  content: {
    flex: 1, // Content takes up the remaining space
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    padding: 10,
  },
  navButtonCenter: {
    padding: 10,
    alignItems: 'center',
    flex: 1,
  },
  navButtonText: {
    fontSize: 16,
    color: '#007aff',
  },
  navBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BuyerHomeScreen;
