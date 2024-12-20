import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import PlaceOrder from './PlaceOrder';

const Stack = createStackNavigator();

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Other content goes here */}
      <View style={styles.content}>
        {/* Main content */}
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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BuyerHome">
        <Stack.Screen name="BuyerHome" component={HomeScreen} />
        <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
      </Stack.Navigator>
    </NavigationContainer>
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
