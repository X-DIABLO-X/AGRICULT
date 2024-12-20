import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PlaceOrder from './PlaceOrder';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Main content area */}
      <View style={styles.content}>
        {/* Content goes here */}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavWrapper}>
        <View style={styles.navBarContainer}>
          {/* Replaced "Home" with "Active Order" */}
          <TouchableOpacity onPress={() => console.log('Active Order pressed!')} style={styles.navButton}>
            <Ionicons name="list-outline" size={30} color="#000" />
            <Text style={styles.navButtonText}>Active Order</Text>
          </TouchableOpacity>

          {/* Replaced "Search" with "Past Order" */}
          <TouchableOpacity onPress={() => console.log('Past Order pressed!')} style={styles.navButton}>
            <Ionicons name="time-outline" size={30} color="#000" />
            <Text style={styles.navButtonText}>Past Order</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('PlaceOrder')} style={styles.navButtonCenter}>
            <View style={styles.centerButton}>
              <Ionicons name="add-outline" size={40} color="#fff" />
            </View>
            {/* Removed the Place Order text */}
          </TouchableOpacity>

          {/* Replaced "Notifications" with "Chats" */}
          <TouchableOpacity onPress={() => console.log('Chat pressed!')} style={styles.navButton}>
            <Ionicons name="chatbubble-outline" size={30} color="#000" />
            <Text style={styles.navButtonText}>Chats</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log('Profile pressed!')} style={styles.navButton}>
            <Ionicons name="person-outline" size={30} color="#000" />
            <Text style={styles.navButtonText}>Profile</Text>
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1, // Content takes up the remaining space
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80, // Reduced height
  },
  navBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 80, // Reduced height to accommodate smaller text
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 10,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonCenter: {
    position: 'relative',
    top: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 60,
    height: 60,
    backgroundColor: '#28a745', // Green color for the "Place Order" button
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Adds shadow effect for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  navButtonText: {
    fontSize: 10, // Decreased font size
    color: '#000',
    marginTop: 3, // Adjusted spacing between the icon and text
  },
});

export default BuyerHomeScreen;
