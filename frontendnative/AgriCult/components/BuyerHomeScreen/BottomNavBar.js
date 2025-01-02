import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import OrderScreen from "./OrderScreen"
import ActiveOrder from "./ActiveOrder"
import ChatList from "../ChatScreen/ChatList"
import ProfilePage from "./ProfilePage"
import PastOrder from "./PastOrder"
import BidsList from './bidList';

const BottomNavBar = () => {
  const [activePage, setActivePage] = useState('ActiveOrder');
  const navigation = useNavigation();

  const renderPage = () => {
    switch (activePage) {
      case 'ActiveOrder':
        return <ActiveOrder />;
      case 'PastOrder':
        return <PastOrder />;
      case 'Bids':
        return <BidsList />;
      case 'Profile':
        return <ProfilePage />;
      default:
        return <ActiveOrder />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderPage()}</View>
      <View style={styles.navBarContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => setActivePage('ActiveOrder')}>
          <Ionicons name="list-outline" size={24} color={activePage === 'ActiveOrder' ? 'blue' : 'black'} />
          <Text style={[styles.navButtonText, activePage === 'ActiveOrder' && styles.activeText]}>Active Order</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.navButton} onPress={() => setActivePage('PastOrder')}>
          <Ionicons name="time-outline" size={24} color={activePage === 'PastOrder' ? 'blue' : 'black'} />
          <Text style={[styles.navButtonText, activePage === 'PastOrder' && styles.activeText]}>Past Order</Text>
        </TouchableOpacity> */}
        
        {/* <View style={styles.navButtonCenter}>
          <TouchableOpacity style={styles.centerButton} onPress={() => navigation.navigate('PlaceOrder')}>
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>
        </View> */}
        
        {/* <TouchableOpacity style={styles.navButton} onPress={() => setActivePage('Bids')}>
          <Ionicons name="cash-outline" size={24} color={activePage === 'Bids' ? 'blue' : 'black'} />
          <Text style={[styles.navButtonText, activePage === 'Bids' && styles.activeText]}>Bids</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.navButton} onPress={() => setActivePage('Profile')}>
          <Ionicons name="person-outline" size={24} color={activePage === 'Profile' ? 'blue' : 'black'} />
          <Text style={[styles.navButtonText, activePage === 'Profile' && styles.activeText]}>Profile</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNavWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80, // Reduced height
  },
  navBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 80, // Reduced height to accommodate smaller text
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 10,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonCenter: {
    position: "relative",
    top: -20,
    alignItems: "center",
    justifyContent: "center",
  },
  centerButton: {
    width: 60,
    height: 60,
    backgroundColor: "#28a745", // Green color for the "Place Order" button
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Adds shadow effect for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  navButtonText: {
    fontSize: 10, // Decreased font size
    color: "#000",
    marginTop: 3, // Adjusted spacing between the icon and text
  },
});

export default BottomNavBar;
