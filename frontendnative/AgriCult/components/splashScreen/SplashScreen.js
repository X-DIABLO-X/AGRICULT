import { View, Text,StyleSheet } from "react-native";
import React from "react";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Agricult</Text>
      <Text>Connecting Farmers</Text>
      
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 20,
  },
});
