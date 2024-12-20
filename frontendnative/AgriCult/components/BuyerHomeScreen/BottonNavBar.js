import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavBar } from './BottonNavBar';

const handleLeftPress = () => {
  console.log('Left button pressed!');
};

const handleRightPress = () => {
  console.log('Right button pressed!');
};

const BuyerHomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buyer Home</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => {/* Navigate to Profile */}}>
            <Ionicons name="person-circle-outline" size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {/* Logout Functionality */}}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Other content goes here */}
      <View style={styles.content}>
        {/* Main content */}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavWrapper}>
        <BottomNavBar
          title="My App"
          leftText="Back"
          rightText="Menu"
          onLeftPress={handleLeftPress}
          onRightPress={handleRightPress}
        />
      </View>
    </View>
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
});

export default BuyerHomeScreen;
